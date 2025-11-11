"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ConnectionIndicatorProps {
  isConnected: boolean;
  isReconnecting?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ConnectionIndicator({
  isConnected,
  isReconnecting = false,
  showLabel = true,
  className = "",
}: ConnectionIndicatorProps) {
  const getStatus = () => {
    if (isReconnecting) {
      return {
        color: "bg-yellow-500",
        icon: RefreshCw,
        text: "Reconectando...",
        pulse: true,
      };
    }
    if (isConnected) {
      return {
        color: "bg-[#0386D9]",
        icon: Wifi,
        text: "Conectado",
        pulse: false,
      };
    }
    return {
      color: "bg-red-500",
      icon: WifiOff,
      text: "Desconectado",
      pulse: false,
    };
  };

  const status = getStatus();
  const Icon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <div className="relative">
        <div
          className={`size-2 rounded-full ${status.color} ${
            status.pulse ? "animate-pulse" : ""
          }`}
        />
        {isConnected && !isReconnecting && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full bg-[#0386D9]"
          />
        )}
      </div>

      {showLabel && (
        <div className="flex items-center gap-1.5">
          <Icon
            className={`size-3.5 ${isReconnecting ? "animate-spin" : ""}`}
          />
          <span className="text-xs text-gray-400">{status.text}</span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Toast notification para cambios de conexión
 */
export function ConnectionToast({
  isConnected,
  onClose,
}: {
  isConnected: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl ${
          isConnected
            ? "bg-[#0386D9]/10 border-[#0386D9]/20"
            : "bg-red-500/10 border-red-500/20"
        }`}
      >
        <div
          className={`size-2 rounded-full ${
            isConnected ? "bg-[#0386D9]" : "bg-red-500"
          } animate-pulse`}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            {isConnected ? "Conexión restaurada" : "Conexión perdida"}
          </p>
          <p className="text-xs text-gray-400">
            {isConnected ? "El chat está en línea" : "Intentando reconectar..."}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
