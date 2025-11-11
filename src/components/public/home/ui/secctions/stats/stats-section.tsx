"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "99.9%",
    label: "Tiempo de actividad",
    description: "Disponibilidad garantizada",
  },
  {
    value: "< 2min",
    label: "Tiempo de respuesta",
    description: "Soporte técnico promedio",
  },
  {
    value: "100+",
    label: "Empresas confían",
    description: "En nuestra plataforma",
  },
  {
    value: "50K+",
    label: "Visitantes gestionados",
    description: "Cada mes en promedio",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0386D9]/5 to-transparent"></div>

      <div className="container mx-auto max-w-7xl px-2 sm:px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
          >
            <span className="text-xs sm:text-sm text-white/90 font-medium">
              Resultados
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
          >
            Números que hablan por{" "}
            <span className="bg-gradient-to-r from-[#0386D9] via-[#0596A6] to-[#763DF2] bg-clip-text text-transparent">
              sí mismos
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto"
          >
            La confianza de nuestros clientes se refleja en cada métrica.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 text-center group hover:border-white/20 transition-all duration-300"
            >
              {/* Gradient on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0386D9]/10 to-[#763DF2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-[#0386D9] via-[#0596A6] to-[#763DF2] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-white/60">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
