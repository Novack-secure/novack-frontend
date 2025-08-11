"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Settings, UserPlus, Zap } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Settings className="h-8 w-8 text-[#07D9D9]" />,
      title: "Configure Your Space",
      description:
        "Customize the platform with your branding, set up your core security settings, and define the services you offer in minutes.",
    },
    {
      icon: <UserPlus className="h-8 w-8 text-[#07D9D9]" />,
      title: "Invite & Onboard",
      description:
        "Add your team members with specific roles and permissions. Seamlessly import your existing clients or let them register through your portal.",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#07D9D9]" />,
      title: "Automate & Grow",
      description:
        "Activate automated reminders, invoicing, and follow-ups. Let the platform handle the repetitive tasks so you can focus on growth.",
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
            Get started in minutes
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Our intuitive platform makes it easy to get up and running.
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
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center flex flex-col items-center"
              >
                <div className="relative z-10 w-24 h-24 flex items-center justify-center bg-black rounded-full mb-6">
                    <div className="w-full h-full bg-gradient-to-r from-[#07D9D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full border-2 border-white/10 flex items-center justify-center">
                        {step.icon}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
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