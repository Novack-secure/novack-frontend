"use client";

import Link from "next/link";

export default function MiniFooter() {
  return (
    <footer className="w-full mt-10">
      <div className="mx-auto px-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between">
          <div className="text-xs sm:text-sm text-white/70">
            © {new Date().getFullYear()} Novack · All rights reserved
          </div>
          <div className="flex gap-4 text-xs sm:text-sm text-white/70">
            <Link
              href="/privacy"
              className="hover:text-[#0386D9] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#0386D9] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-[#0386D9] transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
