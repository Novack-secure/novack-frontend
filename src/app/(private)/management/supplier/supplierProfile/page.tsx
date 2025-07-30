"use client";

export default function Pag() {
  return (
    <main className="h-screen flex">

      {/* RIGHT CONTENT */}
      <section className="flex-1 w-screen bg-amber-400 overflow-auto">
        <div className="w-full flex flex-col bg-amber-500 m-4 p-6 rounded-lg min-h-full">
          {/* Top section with image and info blocks */}
          <div className="grid grid-cols-3 gap-8 bg-amber-700 p-6 rounded-lg">
            {/* Image placeholder */}
            <div className="col-span-1 bg-amber-800 rounded-lg flex items-center justify-center">
              <div className="w-32 h-32 bg-amber-600 rounded-full" />
            </div>

            {/* Info blocks */}
            <div className="col-span-2 flex flex-col justify-center gap-5">
              <div className="bg-amber-800 rounded h-12" />
              <div className="bg-amber-800 rounded h-12" />
              <div className="bg-amber-800 rounded h-12" />
            </div>
          </div>

          {/* Lower info blocks */}
          <div className="mt-8 bg-amber-700 p-6 rounded-lg grid grid-cols-3 gap-6">
            <div className="bg-amber-800 rounded h-16" />
            <div className="bg-amber-800 rounded h-16" />
            <div className="bg-amber-800 rounded h-16" />
            <div className="bg-amber-800 rounded h-16" />
            <div className="bg-amber-800 rounded h-16" />
            <div className="bg-amber-800 rounded h-16" />
          </div>
        </div>
      </section>
    </main>
  );
}
