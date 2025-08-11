"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackHeader() {
  const router = useRouter();
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 m-4 shadow-[0_12px_40px_rgba(0,0,0,0.30)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(1200px_400px_at_-20%_-20%,rgba(7,217,217,0.08),transparent_40%),radial-gradient(800px_300px_at_120%_0%,rgba(7,217,217,0.06),transparent_35%)] before:pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/Imagotipo.svg"
              alt="Novack"
              width={130}
              height={40}
              className="hidden sm:block"
            />
            <Image
              src="/Isotipo.svg"
              alt="Novack"
              width={32}
              height={32}
              className="block sm:hidden"
            />
          </div>
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 px-3 py-1.5 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Create your account
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Follow the steps to complete your registration
          </p>
        </div>
      </div>
    </div>
  );
}
