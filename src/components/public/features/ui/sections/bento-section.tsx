"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { 
    Calendar, 
    Users, 
    ShieldCheck, 
    Database, 
    BarChart3, 
    Lock
} from 'lucide-react';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl bg-white/10 mb-4 flex items-center justify-center">
      {children}
  </div>
);

const BentoCard = ({ variants, className, children }) => (
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
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,_auto)] gap-3 md:gap-4"
        >
          {/* 1. Scheduling */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper><Calendar className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Secure Scheduling</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              Automate and manage appointments with an end-to-end encrypted calendar. Reduce no-shows with automated reminders.
            </p>
          </BentoCard>

          {/* 2. Client Management */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper><Users className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Client Management</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              A unified, protected database for all your client information with granular access controls and audit logs.
            </p>
          </BentoCard>
          
          {/* 3. Secure Data Vault */}
          <BentoCard variants={fadeInUp} className="md:col-span-2 md:row-span-2 !bg-gradient-to-r from-[#07D9D9]/10 to-[#763DF2]/10">
            <IconWrapper><Database className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-2xl font-bold text-white mb-3">Secure Data Vault</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              Store and share sensitive documents with confidence. Our vault uses AES-256 encryption to protect your most critical data at rest and in transit.
            </p>
          </BentoCard>

          {/* 4. Analytics */}
          <BentoCard variants={fadeInUp} className="">
            <IconWrapper><BarChart3 className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Analytics</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              Gain insights with reports on revenue, appointments, and client growth.
            </p>
          </BentoCard>

          {/* 5. Compliance */}
          <BentoCard variants={fadeInUp} className="">
            <IconWrapper><ShieldCheck className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Compliance</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              Built-in security measures to help you stay compliant with HIPAA and GDPR.
            </p>
          </BentoCard>

          {/* 6. Role-Based Access */}
          <BentoCard variants={fadeInUp} className="md:col-span-2">
            <IconWrapper><Lock className="h-6 w-6 text-[#07D9D9]" /></IconWrapper>
            <h3 className="text-xl font-bold text-white mb-3">Role-Based Access</h3>
            <p className="text-white/80 leading-relaxed flex-grow">
              Ensure team members only see what they need to. Customize permissions for every role in your organization.
            </p>
          </BentoCard>

        </motion.div>
      </div>
    </section>
  );
};

export default BentoSection;