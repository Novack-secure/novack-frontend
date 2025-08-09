"use client";

import { Badge } from "@/components/ui/badge";
import { MacbookScroll } from "@/components/ui/macbook";
import { motion } from "framer-motion";

export default function Example() {
  return (
    <section className="w-full pt-3 md:pt-4">
      <div className="mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Left Card - 60% on desktop, full width on mobile */}
          <motion.div
            initial={{ x: -50, opacity: 0.5 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:col-span-3 bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden"
          >
            <div className="hidden lg:block">
              <MacbookScroll
                title={
                  <span>
                    This Macbook is built with Tailwindcss. <br /> No kidding.
                  </span>
                }
                badge={
                  <a href="https://peerlist.io/manuarora">
                    <Badge className="h-10 w-10 -rotate-12 transform" />
                  </a>
                }
                src={`/linear.webp`}
                showGradient={false}
              />
            </div>

            {/* Mobile version - Weekly Activity Card */}
            <div className="sm:hidden">
              <div className="backdrop-blur-sm rounded-xl p-6 border">
                {/* Weekly Activity Graph */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Weekly Activity
                  </h3>

                  {/* Graph Container */}
                  <div className="relative h-48 rounded-lg p-4">
                    {/* Graph Line */}
                    <svg className="w-full h-full" viewBox="0 0 300 150">
                      {/* Background Grid */}
                      <defs>
                        <pattern
                          id="grid"
                          width="50"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 50 0 L 0 0 0 30"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Area Fill */}
                      <path
                        d="M 0 85 Q 25 75 50 95 T 100 80 T 150 90 T 200 70 T 250 85 T 300 80 L 300 150 L 0 150 Z"
                        fill="rgba(7, 217, 217, 0.2)"
                        stroke="none"
                      />

                      {/* Line */}
                      <path
                        d="M 0 85 Q 25 75 50 95 T 100 80 T 150 90 T 200 70 T 250 85 T 300 80"
                        fill="none"
                        stroke="#07D9D9"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Highlight for Thu */}
                      <line
                        x1="150"
                        y1="0"
                        x2="150"
                        y2="150"
                        stroke="rgba(7, 217, 217, 0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <circle
                        cx="150"
                        cy="90"
                        r="4"
                        fill="#07D9D9"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* X-axis Labels */}
                    <div className="flex justify-between text-xs text-white/60 mt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span className="text-[#07D9D9] font-semibold">Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Monitor Users Section */}
                <div className="flex items-start space-x-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Monitor your users
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Track their journey, enhance their productivity, and
                      ensure every move is accounted for in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Card - 40% on desktop, full width on mobile */}
          <motion.div
            initial={{ x: 50, opacity: 0.5 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl shadow-md border border-white/10 relative p-4 sm:p-6 md:p-8"
          >
            <div className="text-center md:text-left space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  Interactive Features
                </h4>
                <p className="text-white/80 text-sm sm:text-base">
                  Explore our powerful tools and capabilities
                </p>
              </motion.div>

              {/* Animated Stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-[#07D9D9] text-2xl font-bold mb-1"
                  >
                    99.9%
                  </motion.div>
                  <div className="text-white/70 text-xs">Uptime</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-[#07D9D9] text-2xl font-bold mb-1"
                  >
                    24/7
                  </motion.div>
                  <div className="text-white/70 text-xs">Support</div>
                </div>
              </motion.div>

              {/* Animated Progress Bar */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-3"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Performance</span>
                  <span className="text-[#07D9D9]">95%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "95%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="bg-gradient-to-r from-[#07D9D9] to-[#0596A6] h-2 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Animated Icons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="flex justify-center md:justify-start space-x-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20"
                >
                  <svg
                    className="w-6 h-6 text-[#07D9D9]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20"
                >
                  <svg
                    className="w-6 h-6 text-[#07D9D9]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20"
                >
                  <svg
                    className="w-6 h-6 text-[#07D9D9]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Animated CTA Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#07D9D9] text-[#010440] px-4 py-3 rounded-lg font-semibold hover:bg-[#0596A6] transition-colors"
                >
                  Explore Features
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
