"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Star,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const plans = [
  {
    name: "Básico",
    price: "$9",
    annualPrice: "$90",
    period: "/mes",
    annualPeriod: "/año",
    description: "Ideal para individuos y equipos pequeños que empiezan.",
    features: [
      "Hasta 3 miembros de equipo",
      "Agendamiento de citas básico",
      "Soporte por correo electrónico",
      "1GB de almacenamiento",
      "Analíticas básicas",
    ],
    popular: false,
    color: "from-[#0386D9] to-[#0596A6]",
    icon: Users,
    badge: "Para empezar",
  },
  {
    name: "Profesional",
    price: "$49",
    annualPrice: "$490",
    period: "/mes",
    annualPeriod: "/año",
    description: "La solución perfecta para negocios en crecimiento.",
    features: [
      "Hasta 15 miembros de equipo",
      "Agendamiento avanzado de citas",
      "Soporte prioritario por correo",
      "Integraciones con apps populares",
      "15GB de almacenamiento",
      "Analíticas avanzadas",
      "Acceso a la API",
      "Recordatorios automáticos",
    ],
    popular: true,
    color: "from-[#763DF2] to-[#202473]",
    icon: Zap,
    badge: "Más popular",
  },
  {
    name: "Empresarial",
    price: "Contáctanos",
    annualPrice: "Contáctanos",
    period: "",
    annualPeriod: "",
    description: "Funciones a medida para grandes organizaciones.",
    features: [
      "Miembros de equipo ilimitados",
      "Soluciones de agendamiento personalizadas",
      "Soporte dedicado 24/7",
      "Integraciones personalizadas",
      "Almacenamiento ilimitado",
      "Analíticas a nivel de empresa",
      "Seguridad avanzada y SSO",
      "Gestor de cuenta dedicado",
    ],
    popular: false,
    color: "from-[#0596A6] to-[#010440]",
    icon: Shield,
    badge: "Para grandes equipos",
  },
];

export function PricingCardsSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="w-full py-4">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0386D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 bg-[#0386D9] rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              Elige tu plan perfecto
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Precios simples y transparentes
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-white/80 max-w-3xl mx-auto"
          >
            Comienza con lo que necesites y escala a medida que tu negocio crece.
            Seguridad de nivel empresarial en todos los planes.
          </motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <span className={`text-sm font-medium transition-colors duration-300 ${!isAnnual ? "text-white" : "text-white/60"}`}>
            Facturación Mensual
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${isAnnual ? "bg-[#0386D9]" : "bg-white/20"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isAnnual ? "translate-x-7" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? "text-white" : "text-white/60"}`}>
            Facturación Anual
          </span>
          {isAnnual && (
            <span className="bg-gradient-to-r from-[#0386D9]/20 to-[#0596A6]/20 text-[#0386D9] px-2 py-1 rounded-full text-xs font-semibold">
              Ahorra 15%
            </span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl p-8 border ${plan.popular ? "border-[#763DF2]" : "border-white/10"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#763DF2] to-[#202473] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="flex-grow">
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    {React.createElement(plan.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-4">{plan.description}</p>
                  <div>
                    <span className="text-4xl font-bold text-white">
                      {isAnnual ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-white/60">
                      {plan.name !== "Empresarial" && (isAnnual ? plan.annualPeriod : plan.period)}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center bg-[#0386D9]/20 rounded-full">
                        <Check className="w-3 h-3 text-[#0386D9]" />
                      </div>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#763DF2] to-[#202473] text-white hover:shadow-lg hover:shadow-[#763DF2]/30"
                      : "bg-gradient-to-r from-[#0386D9] to-[#0596A6] text-white hover:shadow-lg hover:shadow-[#0386D9]/30"
                  }`}
                >
                  {plan.name === "Empresarial" ? "Contactar Ventas" : "Empezar Ahora"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-4 text-white/70 text-sm mt-12"
        >
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Star className="w-4 h-4 text-[#0386D9]" />
            <span className="font-medium">Prueba gratis de 14 días</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Shield className="w-4 h-4 text-[#0386D9]" />
            <span className="font-medium">No se requiere tarjeta de crédito</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Zap className="w-4 h-4 text-[#0386D9]" />
            <span className="font-medium">Cancela en cualquier momento</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
