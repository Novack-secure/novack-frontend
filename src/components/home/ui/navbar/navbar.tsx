"use client";

import { useState, useEffect } from "react";

import { NavbarLink } from "./navbarLink";
import { NavbarMobileLink } from "./navbarMobilLink";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar el fondo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center m-2 sm:m-4 md:m-4
        ${
          isScrolled
            ? "bg-black/40 backdrop-blur-xl shadow-lg border-white/20"
            : "bg-white/5 backdrop-blur-sm"
        } 
        border border-white/10 rounded-xl p-3 px-4 transition-all duration-300`}
      >
        <div className="flex justify-center items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-[#07D9D9] to-[#0596A6] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div className="text-xl font-bold text-white">Novack</div>
        </div>

        <div className="hidden md:flex gap-8 font-medium">
          <NavbarLink href="/" title="Link 1" />
          <NavbarLink href="/" title="Link 2" />
          <NavbarLink href="/" title="Link 3" />
        </div>

        <button className="hidden md:block text-sm border-2 border-[#07D9D9] rounded-xl hover:bg-[#07D9D9] px-6 py-2 hover:text-[#010440] bg-transparent text-[#07D9D9] hover:shadow-lg transition-all duration-300">
          Find a plan
        </button>

        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm p-2 border border-white/20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 my-1 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={`fixed top-24 left-4 right-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-8 md:hidden z-40 shadow-xl transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4">
          <NavbarMobileLink href="/" title="Link 1" />
          <NavbarMobileLink href="/" title="Link 2" />
          <NavbarMobileLink href="/" title="Link 3" />
          <button className="text-lg mt-4 bg-[#07D9D9] px-3 py-3 rounded-xl text-[#010440] hover:bg-[#0596A6] hover:shadow-md transition-all duration-300">
            Find a plan
          </button>
        </div>
      </div>
    </>
  );
};
