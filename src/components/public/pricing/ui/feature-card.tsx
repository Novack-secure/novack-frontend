"use client";

import type React from "react";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface Feature {
  icon: string;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
  stats?: { value: string; label: string }[];
  certifications?: string[];
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  lightning: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
};

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
          >
            <svg
              className={`w-8 h-8 ${
                feature.icon === "lightning" ? "text-[#010440]" : "text-white"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {iconMap[feature.icon]}
            </svg>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>

          <p className="text-white/80 text-sm leading-relaxed mb-6">
            {feature.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-3 mb-6">
          {feature.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-[#07D9D9] rounded-full"></div>
              <span className="text-white/90 text-sm font-medium">
                {highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {feature.stats && (
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              {feature.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-[#07D9D9] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {feature.certifications && (
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs text-white/60 mb-2 font-medium">
              Certifications & Compliance:
            </div>
            <div className="flex flex-wrap gap-2">
              {feature.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-[#07D9D9]/20 text-[#07D9D9] px-2 py-1 rounded-full font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
