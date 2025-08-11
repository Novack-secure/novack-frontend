"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { FeatureCard } from "./feature-card";
import { StatsGrid } from "./stats-grid";

const industryStats = [
  { value: "50+", label: "Industries Served" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Support" },
  { value: "4.9/5", label: "Customer Rating" },
];

const features = [
  {
    icon: "lightning",
    title: "Lightning Fast",
    description:
      "Get up and running in minutes, not hours. Our intuitive interface and powerful automation save you time every day.",
    highlights: [
      "Setup in under 5 minutes",
      "99.9% uptime guarantee",
      "Real-time synchronization",
      "Instant deployment",
    ],
    gradient: "from-[#07D9D9] to-[#0596A6]",
    stats: [
      { value: "5 min", label: "Setup Time" },
      { value: "99.9%", label: "Uptime" },
    ],
  },
  {
    icon: "shield",
    title: "Enterprise Security",
    description:
      "Bank-level encryption, GDPR compliance, and SOC 2 certification. Your data is always protected.",
    highlights: [
      "AES-256 encryption",
      "GDPR & HIPAA compliant",
      "SOC 2 Type II certified",
      "Zero-trust architecture",
    ],
    gradient: "from-[#763DF2] to-[#202473]",
    certifications: ["SOC 2", "GDPR", "HIPAA", "ISO 27001"],
  },
  {
    icon: "users",
    title: "Team Collaboration",
    description:
      "Work seamlessly with your team. Real-time updates, shared calendars, and instant notifications.",
    highlights: [
      "Unlimited team members",
      "Role-based permissions",
      "Real-time collaboration",
      "Advanced integrations",
    ],
    gradient: "from-[#0596A6] to-[#010440]",
    stats: [
      { value: "∞", label: "Team Members" },
      { value: "100+", label: "Integrations" },
    ],
  },
];

export function WhyChooseSection() {
  const { t } = useI18n();
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#07D9D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 bg-[#07D9D9] rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              {t("pricing.why.badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {t("pricing.why.titlePrefix")}{" "}
            <span className="text-[#07D9D9]">Novack</span>?
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {t("pricing.why.subtitle")}
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
            className="bg-gradient-to-r from-[#07D9D9]/10 to-[#763DF2]/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("pricing.trust.title")}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                {t("pricing.trust.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                  Fortune 500
                </div>
                <div className="text-white/80 text-sm">
                  {t("pricing.trust.fortuneNote")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                  Healthcare
                </div>
                <div className="text-white/80 text-sm">
                  {t("pricing.trust.hipaa")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                  Financial
                </div>
                <div className="text-white/80 text-sm">
                  {t("pricing.trust.bank")}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
