import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import React from "react";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Sidebar FUERA del flujo del contenido */}
      <AppSidebar />

      {/* Contenido principal envuelto en el proveedor */}
      <SidebarProvider
        style={
          {
            "--sidebar-width": "25px",
            "--sidebar-trigger-width": "50px",
            "--sidebar-trigger-height": "50px",
          } as React.CSSProperties
        }
      >
        <main className="relative z-10">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
