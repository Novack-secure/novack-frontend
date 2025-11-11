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
          className="bg-linear-to-r from-[#0386D9]/10 to-[#763DF2]/10 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            ¿Listo para verlo en acción?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/80 mb-6 max-w-2xl mx-auto"
          >
            Explora nuestras características con una prueba gratuita y descubre
            cómo Novack puede transformar tu flujo de trabajo.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            <button className="bg-linear-to-r from-[#0386D9] to-[#0596A6] text-[#010440] px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0386D9]/30 transition-all duration-300">
              Comenzar Prueba Gratuita
            </button>
            <button className="border-2 border-[#0386D9] text-[#0386D9] px-6 py-3 rounded-xl font-semibold hover:bg-[#0386D9] hover:text-[#010440] transition-all duration-300">
              Explorar Precios
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
