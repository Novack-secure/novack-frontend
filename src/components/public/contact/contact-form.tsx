"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500),
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
    toast.success("Message Sent!", {
      description: "Thanks for reaching out. We'll get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white mb-2">Send us a message</h2>
        <p className="text-white/70 mb-8">
            Fill out the form and our team will get back to you within 24 hours.
        </p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/80">Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} className="bg-white/10 border-white/20 text-white" />
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
                                <Input placeholder="john.doe@example.com" {...field} className="bg-white/10 border-white/20 text-white" />
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
                            <FormLabel className="text-white/80">Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Regarding your services" {...field} className="bg-white/10 border-white/20 text-white" />
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
                            <FormLabel className="text-white/80">Message</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Your message here..." {...field} className="bg-white/10 border-white/20 text-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-[#07D9D9] to-[#0596A6] text-[#010440] hover:shadow-lg hover:shadow-[#07D9D9]/30">
                    Send Message
                </Button>
            </form>
        </Form>
    </div>
  );
};

export default ContactForm;
