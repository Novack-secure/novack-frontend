"use client";

import { motion } from "framer-motion";
import { Shield, QrCode, BarChart3, MessageSquare, Clock, Zap } from "lucide-react";

export default function BentoGridSection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0386D9]/5 to-transparent"></div>

      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0386D9]/20 to-[#763DF2]/20 border border-[#0386D9]/30 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-[#0386D9]" />
            <span className="text-sm text-white/90 font-medium">Potencia Total</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Todo lo que necesitas,{" "}
            <span className="bg-gradient-to-r from-[#0386D9] via-[#0596A6] to-[#763DF2] bg-clip-text text-transparent">
              nada más
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto"
          >
            Funcionalidades poderosas diseñadas para la seguridad empresarial moderna
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Large Feature - Spans 2 columns on lg */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 lg:p-10 overflow-hidden hover:border-[#0386D9]/50 transition-all duration-500"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0386D9]/10 via-[#0596A6]/5 to-[#763DF2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0386D9] to-[#0596A6] mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Control de Acceso Inteligente
              </h3>

              <p className="text-white/70 text-lg mb-6 max-w-2xl">
                Gestiona permisos de acceso con tecnología biométrica, tarjetas RFID y códigos QR.
                Todo sincronizado en tiempo real con auditoría completa.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">Real-time</div>
                  <div className="text-xs text-white/60">Sincronización</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-xs text-white/60">Auditoría</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">Multi</div>
                  <div className="text-xs text-white/60">Tecnología</div>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-[#0386D9] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
          </motion.div>

          {/* QR Codes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden hover:border-[#763DF2]/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#763DF2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#763DF2] to-[#0596A6] mb-6">
                <QrCode className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Códigos QR Dinámicos
              </h3>

              <p className="text-white/70 text-base">
                Genera códigos únicos para cada visita con expiración automática y validación instantánea.
              </p>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden hover:border-[#0596A6]/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0596A6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0596A6] to-[#0386D9] mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Analytics Avanzado
              </h3>

              <p className="text-white/70 text-base">
                Dashboards interactivos con métricas en tiempo real y reportes personalizados.
              </p>

              {/* Simulated chart */}
              <div className="mt-6 flex items-end gap-2 h-20">
                {[40, 70, 45, 80, 60, 90, 55].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-[#0596A6] to-[#0386D9] rounded-t-lg"
                  ></motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Chat - Spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:row-span-2 group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden hover:border-[#0386D9]/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0386D9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0386D9] to-[#763DF2] mb-6">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Chat en Tiempo Real
              </h3>

              <p className="text-white/70 text-base mb-6">
                Comunicación instantánea entre equipos de seguridad. Coordinación perfecta.
              </p>

              {/* Chat messages simulation */}
              <div className="flex-1 space-y-3">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/5 rounded-2xl rounded-tl-sm p-3 border border-white/10 max-w-[80%]"
                >
                  <div className="text-white text-sm">Visitante en recepción ✓</div>
                  <div className="text-white/50 text-xs mt-1">09:23</div>
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-gradient-to-br from-[#0386D9]/30 to-[#0596A6]/30 rounded-2xl rounded-tr-sm p-3 border border-[#0386D9]/30 max-w-[80%] ml-auto"
                >
                  <div className="text-white text-sm">Autorizado, envío acceso</div>
                  <div className="text-white/50 text-xs mt-1 text-right">09:24</div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="bg-white/5 rounded-2xl rounded-tl-sm p-3 border border-white/10 max-w-[80%]"
                >
                  <div className="text-white text-sm">Perfecto, gracias 👍</div>
                  <div className="text-white/50 text-xs mt-1">09:24</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 overflow-hidden hover:border-[#763DF2]/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#763DF2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#763DF2] to-[#0386D9] mb-6">
                <Clock className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Gestión de Citas
              </h3>

              <p className="text-white/70 text-base mb-6">
                Programa visitas, envía notificaciones y mantén control total del calendario.
              </p>

              {/* Calendar mini view */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((day, i) => (
                  <motion.div
                    key={day}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                      day === 4
                        ? "bg-gradient-to-br from-[#0386D9] to-[#0596A6] text-white font-bold"
                        : "bg-white/5 text-white/60"
                    }`}
                  >
                    {day}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
