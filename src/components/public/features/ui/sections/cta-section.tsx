"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const CtaSection = () => {
  return (
    <section className="w-full pb-2 md:pb-4">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#07D9D9]/10 to-[#763DF2]/10 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to see it in action?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/80 mb-6 max-w-2xl mx-auto"
          >
            Explore our features with a free trial and see how Novack can
            transform your workflow.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-[#07D9D9] to-[#0596A6] text-[#010440] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#07D9D9]/30 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-[#07D9D9] text-[#07D9D9] px-6 py-3 rounded-xl font-semibold hover:bg-[#07D9D9] hover:text-[#010440] transition-all duration-300">
              Explore Pricing
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
