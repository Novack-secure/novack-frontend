import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Citas",
};

export default async function AppointmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-black">
        <AppSidebar />
        <SidebarInset>
          <div className="h-full">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
