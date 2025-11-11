"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Zap, Briefcase, BarChart, Palette } from "lucide-react";

const tips = [
  {
    icon: Zap,
    title: "Automatiza tus recordatorios",
    description:
      "Reduce las ausencias configurando recordatorios automáticos por email y SMS. ¡Una comunicación a tiempo puede aumentar tu tasa de asistencia hasta en un 90%!",
    color: "text-[#0386D9]",
  },
  {
    icon: Briefcase,
    title: "Centraliza tu operación",
    description:
      "Integra Novack con tus herramientas favoritas (calendarios, CRM, etc.) para tener toda tu información en un solo lugar y optimizar tu flujo de trabajo.",
    color: "text-[#763DF2]",
  },
  {
    icon: BarChart,
    title: "Analiza y toma decisiones",
    description:
      "Usa nuestros reportes para entender las horas pico, los servicios más populares y el rendimiento de tu equipo. ¡Datos reales para decisiones inteligentes!",
    color: "text-[#0596A6]",
  },
  {
    icon: Palette,
    title: "Personaliza tu imagen de marca",
    description:
      "Añade tu logo, colores y personaliza tus correos para que la experiencia de tus clientes sea coherente con tu marca, generando más confianza y lealtad.",
    color: "text-[#FF6B6B]",
  },
];

export function TipsSection() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Consejos <span className="text-[#0386D9]">Pro</span> para tu Negocio
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/80 max-w-3xl mx-auto"
          >
            Sácale el máximo provecho a Novack con estos consejos prácticos y
            comienza a ver resultados desde el primer día.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="mb-6">
                {React.createElement(tip.icon, {
                  className: `w-12 h-12 mx-auto ${tip.color}`,
                })}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{tip.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
