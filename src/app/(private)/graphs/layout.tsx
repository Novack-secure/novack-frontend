import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../../globals.css";

export const metadata: Metadata = {
  title: "Novack Redesigning the security",
  description: "Novack is a security company that provides security services.",
};

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
        {children}
      </body>
    </html>
  );
}
