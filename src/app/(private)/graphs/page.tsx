"use client";

export default function Page() {
  return (
    <main className="h-screen flex">
      {/* LEFT COLUMN - APPOINTMENTS */}
      <section className="w-95 bg-red-50 ml-10 border-r border-gray-200 overflow-hidden">
        {/* SEARCH BAR (same as original) */}
        <div className="bg-blue-200 w-50 h-10 mb-3"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        
        <div className="bg-blue-200 w-50 h-10 mb-3"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        
        <div className="bg-blue-200 w-50 h-10 mb-3"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        
        <div className="bg-blue-200 w-50 h-10 mb-3"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
        <div className="bg-blue-200 w-50 h-10 mb-3 ml-4"></div>
      </section>

    <section className="flex-1 w-screen bg-amber-400 overflow-hidden">
      <div className="w-screen flex flex-col bg-amber-500 m-2">
        <div className="w-screen h-40 bg-amber-600 p-5 mb-15" />

        {/* CAMBIO AQUÍ: de flex a grid */}
        <div className="grid grid-cols-2 gap-5 w-full h-full bg-amber-700 p-5">
          <div className="w-95 h-95 bg-amber-800 ml-35"></div>
          <div className="w-95 h-95 bg-amber-800 ml-35"></div>
        </div>
      </div>
    </section>

    </main>
  );
}