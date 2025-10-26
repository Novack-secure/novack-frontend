import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import React from "react";

export default async function PrivateLayout({
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
