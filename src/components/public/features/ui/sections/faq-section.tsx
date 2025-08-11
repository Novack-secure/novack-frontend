"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const faqs = [
  {
    question: "Is my data secure with Novack?",
    answer:
      "Absolutely. Security is our top priority. We use end-to-end encryption for all data, secure cloud infrastructure, and provide tools for role-based access control to ensure your data is always protected.",
  },
  {
    question: "Can I integrate Novack with other tools I use?",
    answer:
      "Yes. Novack is designed to fit into your existing workflow. We offer integrations with popular payment gateways, accounting software, and other business tools. We are also constantly expanding our integration library.",
  },
  {
    question: "What happens if I need to change my plan?",
    answer:
      "You can upgrade or downgrade your plan at any time directly from your account settings. The changes are prorated and take effect immediately, with no downtime.",
  },
  {
    question: "Do you offer support if I run into issues?",
    answer:
      "Of course. We offer 24/7 email support on all plans. Our higher-tier plans also include priority support and a dedicated account manager to help you get the most out of Novack.",
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
            Frequently Asked Questions
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
