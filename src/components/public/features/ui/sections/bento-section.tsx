"use client";
import { motion, type Variants } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  Calendar,
  Users,
  ShieldCheck,
  Database,
  BarChart3,
  Lock,
} from "lucide-react";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl bg-white/10 mb-4 flex items-center justify-center">
    {children}
  </div>
);

interface BentoCardProps {
  variants: Variants;
  className?: string;
  children: React.ReactNode;
}

const BentoCard = ({ variants, className = "", children }: BentoCardProps) => (
  <motion.div
    variants={variants}
    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col ${className}`}
  >
    {children}
  </motion.div>
);

const BentoSection = () => {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-3 md:gap-4"
        >
          {/* 1. Scheduling */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper>
              <Calendar className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">
              Agendamiento Seguro
            </h3>
            <p className="text-white/80 leading-relaxed grow">
              Automatiza y gestiona citas con un calendario cifrado de extremo a
              extremo. Reduce las ausencias con recordatorios automatizados.
            </p>
          </BentoCard>

          {/* 2. Client Management */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper>
              <Users className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">
              Gestión de Clientes
            </h3>
            <p className="text-white/80 leading-relaxed grow">
              Una base de datos unificada y protegida para toda la información
              de tus clientes con controles de acceso granulares y registros de
              auditoría.
            </p>
          </BentoCard>

          {/* 3. Secure Data Vault */}
          <BentoCard
            variants={fadeInUp}
            className="md:col-span-2 md:row-span-2 bg-linear-to-r from-[#0386D9]/10 to-[#763DF2]/10"
          >
            <IconWrapper>
              <Database className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-2xl font-bold text-white mb-3">
              Bóveda de Datos Segura
            </h3>
            <p className="text-white/80 leading-relaxed grow">
              Almacena y comparte documentos sensibles con confianza. Nuestra
              bóveda usa cifrado AES-256 para proteger tus datos más críticos en
              reposo y en tránsito.
            </p>
          </BentoCard>

          {/* 4. Analytics */}
          <BentoCard variants={fadeInUp} className="">
            <IconWrapper>
              <BarChart3 className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Analíticas</h3>
            <p className="text-white/80 leading-relaxed grow">
              Obtén insights con reportes sobre ingresos, citas y crecimiento de
              clientes.
            </p>
          </BentoCard>

          {/* 5. Compliance */}
          <BentoCard variants={fadeInUp} className="">
            <IconWrapper>
              <ShieldCheck className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Cumplimiento</h3>
            <p className="text-white/80 leading-relaxed grow">
              Medidas de seguridad integradas para ayudarte a cumplir con HIPAA
              y GDPR.
            </p>
          </BentoCard>

          {/* 6. Role-Based Access */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper>
              <Lock className="h-6 w-6 text-[#0386D9]" />
            </IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">
              Control de Acceso Basado en Roles
            </h3>
            <p className="text-white/80 leading-relaxed grow">
              Asegúrate de que los miembros del equipo solo vean lo que
              necesitan. Personaliza permisos para cada rol en tu organización.
            </p>
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoSection;
