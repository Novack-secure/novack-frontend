"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface Stat {
  value: string;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={fadeInUp}
          custom={index}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="text-3xl md:text-4xl font-bold text-[#07D9D9] mb-2 group-hover:scale-110 transition-transform duration-300">
            {stat.value}
          </div>
          <div className="text-white/80 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
