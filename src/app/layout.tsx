import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novack Redesigning the security",
  description: "Novack is a security company that provides security services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
