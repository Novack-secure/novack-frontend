import { Inter } from "next/font/google";
import "./../../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";  
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <SidebarProvider
         style={
          {
            "--sidebar-width": "256px",
            "--sidebar-trigger-width": "50px",
            "--sidebar-trigger-height": "50px",
          } as React.CSSProperties
         }>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
      </body>
    </html>
  );
}
