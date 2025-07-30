"use client";
import { Input } from "@/components/ui/input";
import { Search, Send, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="h-screen flex">
      <section className="w-80 bg-red-50 p-5 m-2 border-r border-gray-200 overflow-hidden">
        <div className="flex w-full items-center gap-2 mb-3">
          {/* Search bar */}
          <Input type="email" placeholder="Nombre" />
          <Button type="submit" variant="outline">
            <Search />
          </Button>
        </div>
        <div className="overflow-y-auto scrollbar-hide flex flex-col h-full w-full gap-2">
          <div className="flex flex-col w-full gap-2 p-2">
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
            <div className="bg-amber-100 w-full h-16"></div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex w-full bg-amber-400 overflow-auto">
        <div className="w-screen flex flex-col bg-amber-500 m-2">
          <div className="h-16 bg-amber-600 flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full h-12 w-12 bg-amber-700 flex items-center justify-center">
                {/* Avatar */}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Nombre de usuario</span>
                <span className="text-sm font-medium text-amber-800">
                  Actividad
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6" />
              <File className="w-6 h-6" />
              <Image className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">Área de chat</div>

          <div className="mt-auto rounded mb-4 mx-8 bg-amber-600">
            <form
              className="flex h-12 focus-within:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-200"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Enviar mensaje");
              }}
            >
              <Input
                className="h-full rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                placeholder="Send a message"
              />
              <Button type="submit" className="h-full px-4 rounded-none">
                <Send size={20} />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
