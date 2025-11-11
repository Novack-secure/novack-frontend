"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="w-full pt-2 md:pt-4 pb-2 md:pb-4">
      {" "}
      {/* Consistent vertical padding */}
      <div className="mx-auto px-2 sm:px-4">
        {" "}
        {/* Consistent content width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Main CTA Card - Left side, larger */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-6 md:p-8 lg:p-12"
          >
            <div className="pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-8 lg:pb-12">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-6 text-white"
              >
                ¿Listo para transformar tu
                <span className="text-[#07D9D9]"> negocio?</span>
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-base md:text-lg lg:text-xl text-white/80 mb-8 leading-relaxed"
              >
                Únete a miles de empresas que ya optimizan sus operaciones con
                nuestra plataforma.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                bg-linear-to-r
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative inline-flex items-center justify-center gap-4 group w-full sm:w-auto">
                  <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-linear-to-r from-[#07D9D9] via-[#0596A6] to-[#07D9D9] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                  <Link
                    href="/register"
                    className="group relative inline-flex items-center justify-center text-sm sm:text-base rounded-xl bg-[#07D9D9] px-6 md:px-8 py-3 font-semibold text-[#010440] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-[#07D9D9]/30 w-full sm:w-auto"
                  >
                    Comenzar gratis
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 10 10"
                      height="10"
                      width="10"
                      fill="none"
                      className="mt-0.5 ml-2 -mr-1 stroke-[#010440] stroke-2"
                    >
                      <path
                        d="M0 5h7"
                        className="transition opacity-0 group-hover:opacity-100"
                      ></path>
                      <path
                        d="M1 1l4 4-4 4"
                        className="transition group-hover:translate-x-[3px]"
                      ></path>
                    </svg>
                  </Link>
                </div>

                <Link
                  href="/contact"
                  className="h-12 border-2 border-[#07D9D9] flex justify-center items-center text-[#07D9D9] rounded-xl p-2 px-6 rounded-normal text-sm sm:text-base w-full sm:w-auto
                  transform transition-all duration-300 hover:bg-[#07D9D9] hover:text-[#010440]
                   hover:shadow-lg active:scale-95 hover:-translate-y-0.5"
                >
                  Agendar demo
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Column - Right side, stacked vertically */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 10K+ Stats Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-6 md:p-8"
            >
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#07D9D9]">
                  10K+
                </div>
                <div className="text-sm md:text-base text-white/80">
                  Usuarios activos
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Creciendo cada día
                </div>
              </div>
            </motion.div>

            {/* 99.9% Stats Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
              className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-6 md:p-8"
            >
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#07D9D9]">
                  99.9%
                </div>
                <div className="text-sm md:text-base text-white/80">
                  Disponibilidad
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Servicio confiable
                </div>
              </div>
            </motion.div>

            {/* 24/7 Support Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
              className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-6 md:p-8"
            >
              <div className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-[#07D9D9]">
                  24/7
                </div>
                <div className="text-sm md:text-base text-white/80">
                  Soporte
                </div>
                <div className="mt-4 text-xs text-white/60">
                  Siempre disponible
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
