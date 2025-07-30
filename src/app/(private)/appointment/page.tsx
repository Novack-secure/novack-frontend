"use client";

export default function Page() {
  return (
    <main className="h-screen flex">
      {/* LEFT COLUMN - APPOINTMENTS (matches original w-80 structure) */}
      <section className="w-80 bg-red-50 p-5 m-2 border-r border-gray-200 overflow-hidden">
        {/* SEARCH BAR (same as original) */}
        <div className="display: flex">
          <div className="bg-red-200 w-10 h-10 mb-3"></div>
          <div className="bg-blue-200 w-50 h-10 mb-3"></div>
          <div className="bg-red-200 w-10 h-10 mb-3"></div>
        </div>
        
        {/* APPOINTMENTS LIST */}
        <div className="overflow-y-auto scrollbar-hide flex flex-col h-full w-full gap-2">
          <div className="flex flex-col w-full gap-2 p-2">
            {/* CURRENT APPOINTMENT (highlighted) */}
            <div className="bg-purple-300 w-full h-16"></div>
            
            <div className="bg-green-200 w-full h-16"></div>
            <div className="bg-green-200 w-full h-16"></div>
            <div className="bg-green-200 w-full h-16"></div>
            <div className="bg-green-200 w-full h-16"></div>
            <div className="bg-green-200 w-full h-16"></div>
            <div className="bg-green-200 w-full h-16"></div>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN - MEETING DETAILS (matches original flex-1 structure) */}
      <section className="flex-1 flex w-full bg-amber-400 overflow-auto">
        <div className="w-screen flex flex-col bg-amber-500 m-2">
          </div>
      </section>
    </main>
  );
}