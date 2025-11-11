"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, GripVertical, Home, FileText } from "lucide-react";
import { formTemplateService } from "@/lib/services/form.service";
import { FieldType } from "@/types/form.types";
import type { CreateFormTemplateDto } from "@/types/form.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fieldSchema = z.object({
  field_type: z.nativeEnum(FieldType),
  label: z.string().min(1, "El label es requerido"),
  placeholder: z.string().optional(),
  help_text: z.string().optional(),
  is_required: z.boolean().default(false),
  order: z.number().default(0),
  options: z.array(z.string()).optional(),
  validation_rules: z.record(z.unknown()).optional(),
});

const formSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  slug: z.string().optional(),
  banner: z.string().optional(),
  is_public: z.boolean().default(true),
  requires_approval: z.boolean().default(true),
  notification_emails: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Debe agregar al menos un campo"),
});

type FormValues = z.infer<typeof formSchema>;

const fieldTypeLabels: Record<FieldType, string> = {
  [FieldType.TEXT]: "Texto",
  [FieldType.EMAIL]: "Email",
  [FieldType.PHONE]: "Teléfono",
  [FieldType.NUMBER]: "Número",
  [FieldType.TEXTAREA]: "Área de texto",
  [FieldType.SELECT]: "Selección",
  [FieldType.RADIO]: "Opciones (radio)",
  [FieldType.CHECKBOX]: "Casillas",
  [FieldType.DATE]: "Fecha",
  [FieldType.TIME]: "Hora",
  [FieldType.DATETIME]: "Fecha y hora",
  [FieldType.FILE]: "Archivo",
};

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      banner: "",
      is_public: true,
      requires_approval: true,
      notification_emails: "",
      fields: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  useEffect(() => {
    loadForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const loadForm = async () => {
    try {
      setInitialLoading(true);
      const data = await formTemplateService.findOne(formId);

      // Populate form with existing data
      form.reset({
        name: data.name,
        description: data.description || "",
        slug: data.slug,
        banner: data.banner || "",
        is_public: data.is_public,
        requires_approval: data.requires_approval,
        notification_emails: data.notification_emails?.join(", ") || "",
        fields: data.fields?.map(field => ({
          field_type: field.field_type,
          label: field.label,
          placeholder: field.placeholder || "",
          help_text: field.help_text || "",
          is_required: field.is_required,
          order: field.order,
          options: field.options,
          validation_rules: field.validation_rules,
        })) || [],
      });
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error("Error al cargar formulario", {
        description: errorMessage,
      });
      router.push("/forms");
    } finally {
      setInitialLoading(false);
    }
  };

  const addField = () => {
    append({
      field_type: FieldType.TEXT,
      label: "",
      placeholder: "",
      help_text: "",
      is_required: false,
      order: fields.length,
      options: undefined,
      validation_rules: undefined,
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      // Parse notification emails
      const emails = values.notification_emails
        ? values.notification_emails
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean)
        : [];

      const data: Partial<CreateFormTemplateDto> = {
        name: values.name,
        description: values.description,
        slug: values.slug,
        banner: values.banner,
        is_public: values.is_public,
        requires_approval: values.requires_approval,
        notification_emails: emails,
        fields: values.fields.map((field, index) => ({
          ...field,
          order: index,
        })),
      };

      await formTemplateService.update(formId, data);

      toast.success("Formulario actualizado", {
        description: "El formulario ha sido actualizado exitosamente",
      });

      router.push("/forms");
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Error desconocido';
      toast.error("Error al actualizar formulario", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/forms">Formularios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-[#0386D9]" />
            <div>
              <h2 className="text-xl font-bold text-white">Editar Formulario</h2>
              <p className="text-sm text-slate-400">
                Actualiza la configuración y campos del formulario
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Form Settings */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Configuración del Formulario
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Información básica del formulario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Nombre *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Formulario de Visitantes"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descripción del formulario"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Slug (opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Se generará automáticamente si se deja vacío"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
                          URL amigable para el formulario. Ej: visitantes-principal
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name="banner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Banner (opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="URL de la imagen del banner"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
                          Imagen que se mostrará en la cabecera del formulario público
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                    name="notification_emails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Emails de notificación
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="email1@example.com, email2@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
                          Correos separados por comas que recibirán notificaciones
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                      name="is_public"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">
                              Formulario público
                            </FormLabel>
                            <FormDescription className="text-slate-400">
                              Permitir acceso sin autenticación
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                      name="requires_approval"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-white/10 p-4 bg-white/5">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">
                              Requiere aprobación
                            </FormLabel>
                            <FormDescription className="text-slate-400">
                              Las submissions deben ser aprobadas
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        Campos del Formulario
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Agrega y configura los campos del formulario
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      onClick={addField}
                      variant="outline"
                      className="border-[#0386D9] text-[#0386D9] hover:bg-[#0386D9] hover:text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Campo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {fields.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">No hay campos agregados</p>
                      <Button
                        type="button"
                        onClick={addField}
                        variant="outline"
                        className="border-[#0386D9] text-[#0386D9] hover:bg-[#0386D9] hover:text-black"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar primer campo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <Card
                          key={field.id}
                          className="bg-white/5 border-white/10"
                        >
                          <CardContent className="pt-6">
                            <div className="flex gap-4">
                              <div className="flex flex-col justify-center">
                                <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                              </div>

                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                                  name={`fields.${index}.field_type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white">
                                        Tipo de campo
                                      </FormLabel>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-white/10">
                                          {Object.entries(fieldTypeLabels).map(
                                            ([value, label]) => (
                                              <SelectItem
                                                key={value}
                                                value={value}
                                                className="text-white hover:bg-white/10"
                                              >
                                                {label}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                                  name={`fields.${index}.label`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white">
                                        Label *
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Ej: Nombre completo"
                                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                                  name={`fields.${index}.placeholder`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white">
                                        Placeholder
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Texto de ayuda"
                                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                                  name={`fields.${index}.help_text`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white">
                                        Texto de ayuda
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder="Descripción adicional"
                                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    control={form.control as any}
                                  name={`fields.${index}.is_required`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-white cursor-pointer">
                                        Campo requerido
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="flex flex-col justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/forms")}
                  disabled={loading}
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                >
                  {loading ? "Actualizando..." : "Actualizar Formulario"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
