import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import React from "react";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20px",
          "--sidebar-trigger-width": "50px",
          "--sidebar-trigger-height": "50px",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-row w-full"> {/* 👈 fuerza orden izquierda a derecha */}
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
