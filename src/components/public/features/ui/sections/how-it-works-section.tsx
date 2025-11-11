"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Settings, UserPlus, Zap } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Settings className="h-8 w-8 text-[#0386D9]" />,
      title: "Configura tu Espacio",
      description:
        "Personaliza la plataforma con tu marca, configura tus ajustes de seguridad principales y define los servicios que ofreces en minutos.",
    },
    {
      icon: <UserPlus className="h-8 w-8 text-[#0386D9]" />,
      title: "Invita y Onboard",
      description:
        "Añade a los miembros de tu equipo con roles y permisos específicos. Importa sin problemas tus clientes existentes o déjalos registrarse a través de tu portal.",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#0386D9]" />,
      title: "Automatiza y Crece",
      description:
        "Activa recordatorios, facturación y seguimientos automatizados. Deja que la plataforma maneje las tareas repetitivas para que puedas enfocarte en el crecimiento.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-black">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Comienza en minutos
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Nuestra plataforma intuitiva facilita el inicio y la ejecución.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center flex flex-col items-center"
              >
                <div className="relative z-10 w-24 h-24 flex items-center justify-center bg-black rounded-full mb-6">
                  <div className="w-full h-full bg-linear-to-r from-[#0386D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full border-2 border-white/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
