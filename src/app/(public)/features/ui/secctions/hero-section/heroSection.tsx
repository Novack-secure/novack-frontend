import Link from "next/link";

import { Circles } from "./svg-paths/Circles";
import DecorativePath2 from "./svg-paths/DecorativePath2";
import DecorativePath3 from "./svg-paths/DecorativePath3";
import DecorativePath4 from "./svg-paths/DecorativePath4";
import DecorativePath1 from "./svg-paths/DecorativePath1";

export default function HeroSection() {
  return (
    <section className="w-full md:h-[75vh]">
      <div className="mx-auto h-full">
        <div className="flex flex-col md:flex-row h-full gap-4  ">
          <div className="flex-1 bg-white rounded-xl shadow-md w-full bg-gradient-to-b from-[#FFFFFF] to-[#C4CCD9] relative pl-12">
            <div className=" pt-20 pb-16">
              <h2 className="text-h2 leading-18">
                Manage Every Minute,
                <br /> Find Every Point.
              </h2>
              <p className="text-text-secondary">
                Plan your appointments with precision, monitor locations <br />
                in real time and optimize your every day.
              </p>
            </div>
            {/*Estos path son SVG para abajo de la hero section en la primera caja,
               si alguien quiere puede moverlos a otra carpeta o archivo, 
               mientras se siga la misma arquitectura ya que seria un compoenente dumb*/}
            <div className="absolute bottom-0 left-0 right-0 flex  items-end">
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
            <div className="absolute bottom-0 right-0 flex">
              <DecorativePath2 />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 z-10 relative">
              <div className="relative inline-flex items-center justify-center gap-4 group">
                <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-tertiary via-quaternary to-tertiary rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <Link
                  role="button"
                  className="group relative inline-flex items-center justify-center text-base rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
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
                    className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
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
                className="h-12 border-3 border-primary flex justify-center items-center text-primary p-2 px-6 rounded-normal
                transform transition-all duration-300 hover:bg-primary hover:text-white
                 hover:shadow-lg active:scale-95 hover:-translate-y-0.5"
              >
                Get a Demo for Free
              </Link>
            </div>
          </div>

          <div className="flex-1 rounded-xl shadow-md w-full bg-gradient-hero flex justify-end">
            <div className="absolute">
              <Circles />
            </div>
            <div className="overflow-hidden z-10 h-96 rounded-bl-2xl rounded-tl-2xl border-r-0 bg-gradient-to-br from-blue-400 to-blue-700 w-lg mt-7 border-2 border-gray-300/80 ">
              <h3 className="text-white font-extrabold text-3xl p-2 pl-3">
                Authorization card{" "}
              </h3>
              <div className="relative">
                <span className="hex1 rounded-lg -mt-10 rotate-[27deg] -left-20 absolute h-96 w-96 bg-gradient-to-tr from-white/20 via-transparent to-transparent " />
                <span className="hex1 rounded-lg -mt-42 rotate-[27deg] left-22 absolute h-96  w-96 bg-gradient-to-tr from-white/20 via-transparent to-transparent " />
                <span className="hex1 rounded-lg -mt-72 rotate-[27deg] left-72 absolute h-96 w-86 bg-gradient-to-tr from-white/20 via-transparent to-transparent " />
              </div>
            </div>
            <div className="h-96 z-10 overflow-hidden bg-gradient-to-t from-stone-900 to-gray-950 w-16 mt-7 border-2 border-t-gray-300/80 border-b-gray-300">
              <div className="flex justify-center">
                <span className="text-gray-800 text-sm">
                  5a6541c0e3ba42faa7bf41fe126f49a3928f6367-c87d-47f5-b778-757532ec222efc1576dd-8ea4-45c1-a3ed-5098c5c14571599462c0-8e45-4628-9fb3-91204d8b79c3eb97edcf-d73f-4319-baa4-3b2642fba9791e3f5717-f167-4979-8ec1-bbbed51e2bdca388f575-3f56-41c1-8729-8ebab72137d05a6541c0-e3ba42faa7bf-41fe126f49a3928f6367-c87d-47f5-b778-757532ec222efc1576dd-8ea4-45c1-a3ed-5098c5c14571599462c0-8e45-4628-9fb3-91204d8b79c3eb97edcf-d73f-4319-baa4-3b2642fba9791e3f5717-f167-4979-8ec1-bbbed51e2bdca388f575-3f56-41c1-8729-8ebab72137d05a6541c0e3ba42faa7bf41fe126f49a3928f6367-c87d-47f5-b778-757532ec222efc1576dd-8ea4-45c1-a3ed-5098c5c14571599462c0-8e45-4628-9fb3-91204d8b79c3eb97edcf-d73f-4319-baa4-3b2642fba9791e3f5717-f167-4979-8ec1-bbbed51e2bdca388f575-3f56-41c1-8729-8ebab72137d05a6541c0-e3ba42faa7bf-41fe126f49a3928f6367-c87d-47f5-b778-757532ec222efc1576dd-8ea4-45c1-a3ed-5098c5c14571599462c0-8e45-4628-9fb3-91204d8b79c3eb97edcf-d73f-4319-baa4-3b2642fba9791e3f5717-f167-4979-8ec1-bbbed51e2bdca388f575-3f56-41c1-8729-8ebab72137d0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
