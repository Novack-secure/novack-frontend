"use client";
import Link from "next/link";

import { useState, useEffect } from "react";

import { NavbarLink } from "./navbarLink";
import { NavbarMobileLink } from "./navbarMobilLink";
import Image from "next/image";

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
      <div className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-3 md:pt-4 px-2 sm:px-4">
        <div className="mx-auto h-full">
          <div
            className={`rounded-xl shadow-md border border-white/10 flex justify-between items-center h-[56px] md:h-[72px] relative transition-all duration-300 p-3 px-4 sm:px-6 md:px-8
            ${
              isScrolled
                ? "bg-black/40 backdrop-blur-xl"
                : "bg-white/5 backdrop-blur-sm"
            }`}
          >
            <div className="flex justify-center items-center shrink">
              <Link href="/" className="flex items-center">
                <Image
                  className="hidden md:block"
                  src="/Imagotipo.svg"
                  alt="Logo"
                  width={130}
                  height={40}
                  priority
                />
                <Image
                  className="block md:hidden w-10 h-10"
                  src="/Isotipo.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <NavbarLink href="/" title="Inicio" />
              <NavbarLink href="/pricing" title="Precios" />
              <NavbarLink href="/features" title="Características" />
              <NavbarLink href="/blog" title="Blog" />
            </nav>

            <div className="hidden md:flex items-center gap-3 shrink">
              <Link
                href="/login"
                className="text-sm border-2 border-[#0386D9] rounded-xl hover:bg-[#0386D9] px-4 py-2 hover:text-[#010440] bg-transparent text-[#0386D9] hover:shadow-lg transition-all duration-300 whitespace-nowrap font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="text-sm border-2 border-[#0386D9] rounded-xl hover:bg-[#0386D9] px-4 py-2 hover:text-[#010440] bg-transparent text-[#0386D9] hover:shadow-lg transition-all duration-300 whitespace-nowrap font-medium"
              >
                Registrarse
              </Link>
            </div>

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
        </div>
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
          <NavbarMobileLink href="/" title="Inicio" />
          <NavbarMobileLink href="/pricing" title="Precios" />
          <NavbarMobileLink href="/features" title="Características" />
          <NavbarMobileLink href="/blog" title="Blog" />
          <button className="text-lg mt-4 bg-[#0386D9] px-3 py-3 rounded-xl text-[#010440] hover:bg-[#0270BE] hover:shadow-md transition-all duration-300">
            Elegir un plan
          </button>
        </div>
      </div>
    </>
  );
};
