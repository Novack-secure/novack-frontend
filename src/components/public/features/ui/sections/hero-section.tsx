"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const HeroSection = () => {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center pt-8 md:pt-12"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#07D9D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 bg-[#07D9D9] rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              Core Features
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Everything you need, nothing you don't
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Discover how Novack's powerful, secure, and intuitive features can
            transform your business operations from the ground up.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;