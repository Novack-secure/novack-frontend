"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios tienen efecto inmediatamente sin tiempo de inactividad.",
  },
  {
    question: "¿Hay una prueba gratuita?",
    answer:
      "Ofrecemos una prueba gratuita de 14 días en todos los planes. No se requiere tarjeta de crédito para comenzar. Acceso completo a todas las funciones.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias para planes anuales. Procesamiento de pagos seguro.",
  },
  {
    question: "¿Ofrecen reembolsos?",
    answer:
      "Ofrecemos una garantía de devolución de dinero de 30 días. Si no estás satisfecho, te devolveremos tu pago sin preguntas.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full pt-2 md:pt-4 pb-2 md:pb-4">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-4 pt-8 md:pt-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Preguntas <span className="text-[#0386D9]">Frecuentes</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {faqs.map((faq, index) => (
            <motion.div variants={fadeInUp} key={index}>
              <Collapsible.Root
                onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}
                open={openIndex === index}
                className="bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10"
              >
                <Collapsible.Trigger className="w-full p-6 text-left flex justify-between items-center">
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronDown className="h-5 w-5 text-white/60" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-white/60" />
                  )}
                </Collapsible.Trigger>
                <AnimatePresence>
                  {openIndex === index && (
                    <Collapsible.Content forceMount asChild>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/80 leading-relaxed px-6 pb-6">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </Collapsible.Content>
                  )}
                </AnimatePresence>
              </Collapsible.Root>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
