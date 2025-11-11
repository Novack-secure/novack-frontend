"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Shield, BarChart, QrCode, MessageSquare, Clock } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Gestión de Visitantes",
    description:
      "Pre-registra visitantes, genera códigos QR y controla el acceso de forma automatizada. Mantén un registro completo de todas las visitas.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
  {
    icon: Shield,
    title: "Control de Acceso",
    description:
      "Administra credenciales de empleados y visitantes con tarjetas inteligentes. Control basado en roles y permisos personalizados.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
  {
    icon: BarChart,
    title: "Monitoreo en Tiempo Real",
    description:
      "Dashboards interactivos con métricas de seguridad, reportes de actividad y análisis de tendencias para tomar mejores decisiones.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
  {
    icon: QrCode,
    title: "Códigos QR Dinámicos",
    description:
      "Genera códigos QR únicos para cada visita con validación en tiempo real. Acceso rápido y seguro sin contacto físico.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
  {
    icon: MessageSquare,
    title: "Chat en Tiempo Real",
    description:
      "Comunicación instantánea entre equipos de seguridad. Coordinación eficiente y respuesta rápida ante cualquier situación.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
  {
    icon: Clock,
    title: "Gestión de Citas",
    description:
      "Programa y administra citas de visitantes. Notificaciones automáticas y seguimiento del estado de cada visita programada.",
    color: "text-[#07D9D9]",
    gradient: "from-[#07D9D9]/10 to-[#07D9D9]/5",
  },
];

export default function FeatureHighlightSection() {
  return (
    <section className="w-full relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07D9D9]/5 to-transparent"></div>

      <div className="mx-auto px-2 sm:px-4 relative z-10">
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
          >
            <span className="text-sm sm:text-base text-white/90 font-medium">
              Funcionalidades
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight"
          >
            Todo lo que necesitas en{" "}
            <span className="text-[#07D9D9]">
              un solo lugar
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed"
          >
            Herramientas potentes y fáciles de usar para gestionar la seguridad
            de tu empresa de forma profesional.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 sm:p-10 lg:p-12 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`mb-6 sm:mb-8 ${feature.color}`}>
                  {React.createElement(feature.icon, {
                    className: "w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20",
                    strokeWidth: 1.5,
                  })}
                </div>

                {/* Content */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-5">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
