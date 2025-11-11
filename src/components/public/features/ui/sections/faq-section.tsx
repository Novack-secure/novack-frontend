"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const faqs = [
  {
    question: "¿Mis datos están seguros con Novack?",
    answer:
      "Absolutamente. La seguridad es nuestra máxima prioridad. Usamos cifrado de extremo a extremo para todos los datos, infraestructura en la nube segura y proporcionamos herramientas para control de acceso basado en roles para asegurar que tus datos siempre estén protegidos.",
  },
  {
    question: "¿Puedo integrar Novack con otras herramientas que uso?",
    answer:
      "Sí. Novack está diseñado para encajar en tu flujo de trabajo existente. Ofrecemos integraciones con pasarelas de pago populares, software de contabilidad y otras herramientas comerciales. También estamos expandiendo constantemente nuestra biblioteca de integraciones.",
  },
  {
    question: "¿Qué pasa si necesito cambiar mi plan?",
    answer:
      "Puedes actualizar o degradar tu plan en cualquier momento directamente desde la configuración de tu cuenta. Los cambios son prorrateados y tienen efecto inmediatamente, sin tiempo de inactividad.",
  },
  {
    question: "¿Ofrecen soporte si tengo problemas?",
    answer:
      "Por supuesto. Ofrecemos soporte por email 24/7 en todos los planes. Nuestros planes de nivel superior también incluyen soporte prioritario y un gerente de cuenta dedicado para ayudarte a aprovechar al máximo Novack.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-2 md:py-4 bg-black">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Preguntas Frecuentes
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-4"
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
};

export default FaqSection;
