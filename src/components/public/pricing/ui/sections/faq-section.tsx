"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with no downtime.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a 14-day free trial on all plans. No credit card required to start. Full access to all features.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans. Secure payment processing.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment no questions asked.",
  },
];

export function FaqSection() {
  const { t } = useI18n();
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
            {t("pricing.faq.titlePrefix")}{" "}
            <span className="text-[#07D9D9]">
              {t("pricing.faq.titleHighlight")}
            </span>
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
