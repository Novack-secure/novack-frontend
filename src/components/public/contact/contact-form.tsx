"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z
    .string()
    .email({ message: "Por favor ingresa una dirección de email válida." }),
  subject: z
    .string()
    .min(5, { message: "El asunto debe tener al menos 5 caracteres." }),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres." })
    .max(500),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is a mock submission.
    console.log(values);
    toast.success("¡Mensaje Enviado!", {
      description: "Gracias por contactarnos. Te responderemos pronto.",
    });
    form.reset();
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
      <h2 className="text-3xl font-bold text-white mb-2">
        Envíanos un mensaje
      </h2>
      <p className="text-white/70 mb-8">
        Completa el formulario y nuestro equipo te responderá en 24 horas.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Juan Doe"
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="juan.doe@ejemplo.com"
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Asunto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Respecto a tus servicios"
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">Mensaje</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tu mensaje aquí..."
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-[#0386D9] to-[#0596A6] text-[#010440] hover:shadow-lg hover:shadow-[#0386D9]/30"
          >
            Enviar Mensaje
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
