"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import {
  formTemplateService,
  formSubmissionService,
} from "@/lib/services/form.service";
import { FieldType } from "@/types/form.types";
import type { FormTemplate, SubmitFormDto } from "@/types/form.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await formTemplateService.findBySlug(slug);
      setTemplate(data);
      buildFormSchema(data);
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      setError(apiError?.response?.data?.message || "Formulario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const buildFormSchema = (template: FormTemplate) => {
    const schemaShape: Record<string, z.ZodTypeAny> = {
      visitor_name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres"),
      visitor_email: z.string().email("Email inválido"),
      visitor_phone: z.string().optional(),
      visitor_company: z.string().optional(),
    };

    template.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.field_type) {
        case FieldType.EMAIL:
          fieldSchema = z.string().email("Email inválido");
          break;
        case FieldType.NUMBER:
          fieldSchema = z.string().regex(/^\d+$/, "Debe ser un número");
          break;
        case FieldType.PHONE:
          fieldSchema = z.string().min(8, "Teléfono inválido");
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.is_required) {
        schemaShape[field.id] = (fieldSchema as z.ZodString).min(
          1,
          `${field.label} es requerido`
        );
      } else {
        schemaShape[field.id] = fieldSchema.optional();
      }
    });

    setFormSchema(z.object(schemaShape));
  };

  const [formSchema, setFormSchema] = useState<z.ZodObject<Record<string, z.ZodTypeAny>>>(
    z.object({
      visitor_name: z.string(),
      visitor_email: z.string(),
    })
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitor_name: "",
      visitor_email: "",
      visitor_phone: "",
      visitor_company: "",
    },
  });

  const onSubmit = async (values: Record<string, unknown>) => {
    if (!template) return;

    try {
      setSubmitting(true);

      const answers = template.fields.map((field) => {
        const fieldValue = values[field.id];
        let convertedValue: string | number | boolean | null | undefined;
        
        if (fieldValue === null || fieldValue === undefined) {
          convertedValue = undefined;
        } else if (typeof fieldValue === "string" || typeof fieldValue === "number" || typeof fieldValue === "boolean") {
          convertedValue = fieldValue;
        } else {
          convertedValue = String(fieldValue);
        }
        
        return {
          field_id: field.id,
          value: convertedValue,
        };
      });

      const submitData: SubmitFormDto = {
        visitor_name: String(values.visitor_name || ""),
        visitor_email: String(values.visitor_email || ""),
        visitor_phone: values.visitor_phone ? String(values.visitor_phone) : undefined,
        visitor_company: values.visitor_company ? String(values.visitor_company) : undefined,
        answers,
      };

      await formSubmissionService.submit(slug, submitData);
      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError?.response?.data?.message || "Error al enviar formulario");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormTemplate["fields"][0]) => {
    switch (field.field_type) {
      case FieldType.TEXT:
      case FieldType.EMAIL:
      case FieldType.PHONE:
      case FieldType.NUMBER:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={
                      field.field_type === FieldType.NUMBER ? "number" : "text"
                    }
                    placeholder={field.placeholder}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </FormControl>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.TEXTAREA:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder={field.placeholder}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    rows={4}
                  />
                </FormControl>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.SELECT:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-slate-500">
                      <SelectValue
                        placeholder={field.placeholder || "Seleccionar"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {field.options?.map((option: string, index: number) => (
                      <SelectItem
                        key={index}
                        value={option}
                        className="text-white hover:bg-white/10"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.RADIO:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="space-y-2"
                  >
                    {field.options?.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${field.id}-${index}`}
                        />
                        <Label
                          htmlFor={`${field.id}-${index}`}
                          className="cursor-pointer text-white"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.DATE:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="date"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </FormControl>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case FieldType.TIME:
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-white">
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="time"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </FormControl>
                {field.help_text && (
                  <FormDescription className="text-slate-400">
                    {field.help_text}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0386D9] mx-auto mb-4" />
          <p className="text-slate-400">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <Card className="max-w-md w-full bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle className="text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <Card className="max-w-md w-full bg-slate-900 border-white/10">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Formulario enviado!
            </h2>
            <p className="text-slate-400 mb-6">
              {template?.requires_approval
                ? "Tu solicitud está pendiente de aprobación. Recibirás una notificación por email."
                : "¡Gracias! Tu información ha sido recibida exitosamente."}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0386D9] to-[#0596A6] shadow-lg">
              <Image src="/favicon.ico" alt="Novack" width={40} height={40} className="size-10" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Novack</div>
              <div className="text-xs text-[#0386D9]">Security Platform</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">{template.name}</h1>
          {template.description && (
            <p className="text-slate-400 mt-2">{template.description}</p>
          )}
        </div>

        {/* Form Card */}
        <Card className="bg-slate-900 border-white/10 shadow-xl">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Visitor Info */}
                <div className="space-y-4 pb-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">
                    Información del Visitante
                  </h3>

                  <FormField
                    control={form.control}
                    name="visitor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Nombre completo{" "}
                          <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Tu nombre completo"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitor_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Email <span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="tu@email.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="visitor_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="+506 1234-5678"
                              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitor_company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Empresa</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nombre de tu empresa"
                              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dynamic Fields */}
                {template.fields.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Información Adicional
                    </h3>
                    {template.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field) => renderField(field))}
                  </div>
                )}

                {/* Submit */}
                <div className="pt-6 flex justify-end gap-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#0386D9] hover:bg-[#0270BE] text-black px-8"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Formulario"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Powered by {template.supplier?.supplier_name || "Novack"}
          </p>
        </div>
      </div>
    </div>
  );
}
