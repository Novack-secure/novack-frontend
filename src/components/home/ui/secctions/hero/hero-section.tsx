"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import { Circles } from "./svg-paths/Circles";
import GlareHover from "@/components/ui/glare-hover";
import DecorativePath2 from "./svg-paths/DecorativePath2";
import DecorativePath3 from "./svg-paths/DecorativePath3";
import DecorativePath4 from "./svg-paths/DecorativePath4";
import DecorativePath1 from "./svg-paths/DecorativePath1";

export default function HeroSection() {
  return (
    <section className="w-full md:h-[70vh] mt-12 sm:mt-16 md:mt-20">
      <div className="mx-auto h-full px-2 sm:px-4">
        <div className="flex flex-col lg:flex-row h-full gap-3 sm:gap-4">
          {/* Left Content Column */}
          <motion.div
            initial={{ x: -50, opacity: 0.5 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex-1 rounded-xl shadow-md bg-white/5 backdrop-blur-sm border border-white/10 relative p-4 sm:p-6 md:p-8 lg:pl-12"
          >
            <div className="pt-16 sm:pt-8 md:pt-12 lg:pt-16 pb-6 sm:pb-8 md:pb-12 lg:pb-16">
              <h2 className="text-3xl md:text-5xl lg:text-5xl leading-tight font-bold lg:text-left text-white">
                Manage Every Minute,
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Find Every Point.
              </h2>
              <p className="text-base lg:text-xl md:text-lg mt-6 sm:mt-4 text-white/80 lg:text-left">
                Plan your appointments with precision, monitor locations
                <br />
                <span className="hidden sm:inline lg:hidden">
                  {" "}
                  in real time and optimize your every day.
                </span>
                <br />
                <span className="sm:hidden">
                  {" "}
                  in real time and optimize your day.
                </span>
              </p>
            </div>

            {/* Decorative SVG Paths - Hidden on small screens */}
            <div className="hidden lg:block absolute bottom-0 left-0 right-0 md:flex items-end">
              <div className="pb-10">
                <div className="pb-10">
                  <DecorativePath1 />
                </div>
                <div className="pl-20">
                  <DecorativePath4 />
                </div>
                <div className="pl-52">
                  <DecorativePath3 />
                </div>
              </div>
            </div>
            <div className="md:hidden lg:block absolute bottom-0 right-0 flex">
              <DecorativePath2 />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 relative mb-20 mt-10">
              <div className="relative inline-flex items-center justify-center gap-4 group w-full sm:w-auto">
                <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-[#07D9D9] via-[#0596A6] to-[#07D9D9] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <Link
                  role="button"
                  className="group relative inline-flex items-center justify-center text-sm sm:text-base rounded-xl bg-[#07D9D9] px-4 sm:px-6 md:px-8 py-3 font-semibold text-[#010440] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-[#07D9D9]/30 w-full sm:w-auto"
                  title="payment"
                  href="/"
                >
                  Create an Account
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="mt-0.5 ml-2 -mr-1 stroke-[#010440] stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="transition opacity-0 group-hover:opacity-100"
                    ></path>
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </Link>
              </div>

              <Link
                href={"/"}
                className="h-12 border-2 border-[#07D9D9] flex justify-center items-center text-[#07D9D9] rounded-xl p-2 px-4 sm:px-6 rounded-normal text-sm sm:text-base w-full sm:w-auto
                transform transition-all duration-300 hover:bg-[#07D9D9] hover:text-[#010440]
                 hover:shadow-lg active:scale-95 hover:-translate-y-0.5"
              >
                Get a Demo for Free
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Column */}
          <motion.div
            initial={{ x: 50, opacity: 0.5 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="z-10 flex-1 rounded-xl shadow-md bg-white/5 backdrop-blur-sm border border-white/10 lg:flex justify-center lg:justify-end relative min-h-[300px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#07D9D9]/10 via-[#0596A6]/5 to-[#763DF2]/10"></div>
            <div className="hidden lg:block absolute">
              <Circles />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-60"></div>

            {/* Authorization Card */}
            <div className="block lg:hidden absolute bottom-0 right-0 w-11/12 md:w-2/3 h-auto -mb-4 md:-mb-10 sm:-mb-10 -mr-4 md:-mr-10  sm:-mr-10 ">
              <GlareHover
                style={{
                  background: "",
                  border: "0px",
                  width: "100%",
                  height: "100%",
                  borderRadius: "18px",
                }}
                glareColor="#07D9D9"
                glareOpacity={0.3}
                transitionDuration={800}
                playOnce={true}
              >
                <Image
                  src="/Card.png"
                  alt="Authorization Card"
                  width={600}
                  height={400}
                />
              </GlareHover>
            </div>

            <div className="hidden lg:block z-10 absolute mt-10 -mr-10 p-4 sm:p-6 lg:p-0">
              <GlareHover
                style={{
                  background: "",
                  border: "0px",
                  width: "100%",
                  height: "100%",
                  borderRadius: "18px",
                }}
                glareColor="#07D9D9"
                glareOpacity={0.3}
                transitionDuration={800}
                playOnce={true}
              >
                <Image
                  src="/Card.png"
                  alt="Authorization Card"
                  width={600}
                  height={400}
                  className="block w-full max-w-[400px] xl:max-w-[600px] h-auto object-contain"
                />
              </GlareHover>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
