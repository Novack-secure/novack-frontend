"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { FeatureCard } from "./feature-card";
import { StatsGrid } from "./stats-grid";

const industryStats = [
  { value: "50+", label: "Industrias Atendidas" },
  { value: "150+", label: "Países" },
  { value: "24/7", label: "Soporte" },
  { value: "4.9/5", label: "Calificación de Clientes" },
];

const features = [
  {
    icon: "lightning",
    title: "Ultra Rápido",
    description:
      "Pon tu sistema en funcionamiento en minutos, no horas. Nuestra interfaz intuitiva y automatización potente te ahorran tiempo cada día.",
    highlights: [
      "Configuración en menos de 5 minutos",
      "Garantía de 99.9% de disponibilidad",
      "Sincronización en tiempo real",
      "Despliegue instantáneo",
    ],
    gradient: "from-[#0386D9] to-[#0596A6]",
    stats: [
      { value: "5 min", label: "Tiempo de Configuración" },
      { value: "99.9%", label: "Disponibilidad" },
    ],
  },
  {
    icon: "shield",
    title: "Seguridad Empresarial",
    description:
      "Cifrado de nivel bancario, cumplimiento GDPR y certificación SOC 2. Tus datos siempre están protegidos.",
    highlights: [
      "Cifrado AES-256",
      "Cumplimiento GDPR e HIPAA",
      "Certificado SOC 2 Type II",
      "Arquitectura zero-trust",
    ],
    gradient: "from-[#763DF2] to-[#202473]",
    certifications: ["SOC 2", "GDPR", "HIPAA", "ISO 27001"],
  },
  {
    icon: "users",
    title: "Colaboración en Equipo",
    description:
      "Trabaja sin problemas con tu equipo. Actualizaciones en tiempo real, calendarios compartidos y notificaciones instantáneas.",
    highlights: [
      "Miembros ilimitados del equipo",
      "Permisos basados en roles",
      "Colaboración en tiempo real",
      "Integraciones avanzadas",
    ],
    gradient: "from-[#0596A6] to-[#010440]",
    stats: [
      { value: "∞", label: "Miembros del Equipo" },
      { value: "100+", label: "Integraciones" },
    ],
  },
];

export function WhyChooseSection() {
  return (
    <section className="w-full pt-2 md:pt-4 pb-2 md:pb-4">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-4 pt-8 md:pt-12" // Keep pt-8 md:pt-12 for internal spacing
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#0386D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 bg-[#0386D9] rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              Por qué las empresas eligen Novack
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            ¿Por qué elegir <span className="text-[#0386D9]">Novack</span>?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            No somos otra herramienta de citas. Somos tu socio estratégico en
            crecimiento, con seguridad empresarial y rendimiento incomparable.
          </motion.p>

          <StatsGrid stats={industryStats} />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Additional Trust Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-3 md:mt-4" // Keep internal spacing
        >
          <motion.div
            variants={fadeInUp}
            className="bg-linear-to-r from-[#0386D9]/10 to-[#763DF2]/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Confiado por líderes de la industria
              </h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                Únete a miles de empresas que confían en Novack para sus
                operaciones críticas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0386D9] mb-2">
                  Fortune 500
                </div>
                <div className="text-white/80 text-sm">
                  Empresas confían en nosotros
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0386D9] mb-2">
                  Healthcare
                </div>
                <div className="text-white/80 text-sm">Cumplimiento HIPAA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0386D9] mb-2">
                  Financial
                </div>
                <div className="text-white/80 text-sm">
                  Seguridad de nivel bancario
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
