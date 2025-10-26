"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
  config?: any;
  data?: any[];
}

export default function Globe({ className, config, data }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      {/* Simple animated circles as a fallback */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-96 h-96 border border-[#07D9D9]/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="w-80 h-80 border border-[#07D9D9]/30 rounded-full absolute"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 border border-[#07D9D9]/40 rounded-full absolute"
        />
      </div>
    </div>
  );
}
