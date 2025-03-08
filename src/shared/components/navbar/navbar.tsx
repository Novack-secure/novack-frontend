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
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center m-4 
        ${
          isScrolled
            ? "bg-white/60 backdrop-blur-xl shadow-lg border-opacity-30"
            : "bg-white"
        } 
        border-2 border-gray-200 rounded-xl p-3 px-4 transition-all duration-300`}
      >
        <div className="flex justify-center items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-md"></div>
          <div className="text-xl font-bold text-primary pb-0.5">Novack</div>
        </div>

        <div className="hidden md:flex gap-8 font-medium">
          <NavbarLink href="/" title="Link 1" />
          <NavbarLink href="/" title="Link 2" />
          <NavbarLink href="/" title="Link 3" />
        </div>

        <button className="hidden md:block text-sm border-1 border-primary hover:bg-primary px-6 py-2 rounded-3xl hover:text-white bg-transparent text-primary hover:shadow-lg transition-all duration-300">
          Find a plan
        </button>

        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full bg-primary p-2"
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
        className={`fixed top-24 left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl p-6 md:hidden z-40 shadow-xl transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-4">
          <NavbarMobileLink href="/" title="Link 1" />
          <NavbarMobileLink href="/" title="Link 2" />
          <NavbarMobileLink href="/" title="Link 3" />
          <button className="text-lg mt-4 bg-primary px-3 py-3 rounded-3xl text-white hover:bg-white hover:text-primary hover:shadow-md hover:border-primary border-2 border-transparent transition-all duration-300">
            Find a plan
          </button>
        </div>
      </div>
    </>
  );
};
