"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full text-white">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Company Info Card - Large */}
          <motion.div
            initial={{ y: 50, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 relative p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#07D9D9] to-[#0596A6] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div className="text-2xl font-bold text-white">Novack</div>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed max-w-md">
              Transform your business operations with our powerful management
              platform. Join thousands of companies that trust Novack for their
              success.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="/"
                className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#07D9D9]/20 transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link
                href="/"
                className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#07D9D9]/20 transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Link>
              <Link
                href="/"
                className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#07D9D9]/20 transition-all duration-200 hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Product Links Card */}
          <motion.div
            initial={{ y: 50, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 relative p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">
              Stay Updated
            </h3>
            <p className="text-white/70 mb-4 text-sm">
              Get the latest updates and insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#07D9D9] transition-colors"
              />
              <button className="bg-[#07D9D9] hover:bg-[#0596A6] text-[#010440] font-semibold px-4 py-2 rounded-lg transition-colors">
                →
              </button>
            </div>
          </motion.div>

          {/* Company Links Card */}
          <motion.div
            initial={{ y: 50, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 relative p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-[#07D9D9] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#07D9D9] rounded-full group-hover:scale-150 transition-transform"></span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-[#07D9D9] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#07D9D9] rounded-full group-hover:scale-150 transition-transform"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-[#07D9D9] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#07D9D9] rounded-full group-hover:scale-150 transition-transform"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-[#07D9D9] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#07D9D9] rounded-full group-hover:scale-150 transition-transform"></span>
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-[#07D9D9] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#07D9D9] rounded-full group-hover:scale-150 transition-transform"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.4 }}
            className="md:col-span-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 relative p-6 md:p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm">
                © 2024 Novack. All rights reserved.
              </div>

              <div className="flex gap-6 text-sm">
                <Link
                  href="/"
                  className="text-white/60 hover:text-[#07D9D9] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/"
                  className="text-white/60 hover:text-[#07D9D9] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/"
                  className="text-white/60 hover:text-[#07D9D9] transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
