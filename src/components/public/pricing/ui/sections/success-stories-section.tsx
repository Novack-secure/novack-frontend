"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Star } from "lucide-react"; // Assuming Star icon is available from lucide-react

export function SuccessStoriesSection() {
  const { t } = useI18n();
  return (
    <section className="w-full pt-2 md:pt-4 pb-2 md:pb-4">
      <div className="mx-auto px-2 sm:px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-4 pt-8 md:pt-12"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#07D9D9]/20 to-[#763DF2]/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 mb-6"
          >
            <div className="w-2 h-2 bg-[#07D9D9] rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">
              {t("pricing.success.badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {t("pricing.success.titlePrefix")}{" "}
            <span className="text-[#07D9D9]">
              {t("pricing.success.titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {t("pricing.success.subtitle")}
          </motion.p>

          {/* ROI Calculator Preview */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-[#07D9D9]/10 to-[#763DF2]/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("pricing.success.roiTitle")}
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                {t("pricing.success.roiSubtitle")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                    $2,400
                  </div>
                  <div className="text-white/60 text-sm">
                    {t("pricing.success.roi.monthlySavings")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                    15 hrs
                  </div>
                  <div className="text-white/60 text-sm">
                    {t("pricing.success.roi.timeSaved")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#07D9D9] mb-2">
                    300%
                  </div>
                  <div className="text-white/60 text-sm">
                    {t("pricing.success.roi.sixMonths")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#07D9D9] to-[#0596A6] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-[#010440] font-bold text-2xl">M</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  Medical Clinic Pro
                </h3>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                  "Novack helped us reduce no-shows by 85% and increased our
                  daily patient capacity by 40%. The automated reminders are a
                  game-changer."
                </p>
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-white/60 mb-3 font-medium">
                    Results achieved:
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">No-shows:</span>
                      <span className="text-[#07D9D9] font-bold">-85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Capacity:</span>
                      <span className="text-[#07D9D9] font-bold">+40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Revenue:</span>
                      <span className="text-[#07D9D9] font-bold">+60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Time saved:</span>
                      <span className="text-[#07D9D9] font-bold">20hrs/wk</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex text-[#07D9D9]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-white/60 text-sm font-medium">
                    Dr. Sarah Johnson, CEO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#763DF2] to-[#202473] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  TechStart Solutions
                </h3>
                <p className="text-white/80 text-base leading-relaxed mb-6">
                  "We've streamlined our entire client onboarding process. What
                  used to take days now happens in hours. Novack is essential to
                  our growth."
                </p>
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-sm text-white/60 mb-3 font-medium">
                    Results achieved:
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Onboarding:</span>
                      <span className="text-[#07D9D9] font-bold">-80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Efficiency:</span>
                      <span className="text-[#07D9D9] font-bold">+300%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Growth:</span>
                      <span className="text-[#07D9D9] font-bold">+150%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">
                        Client satisfaction:
                      </span>
                      <span className="text-[#07D9D9] font-bold">98%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex text-[#07D9D9]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-white/60 text-sm font-medium">
                    Mike Chen, Founder
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
