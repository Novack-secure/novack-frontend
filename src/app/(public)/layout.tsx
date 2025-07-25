import type { Metadata } from "next";
import { Navbar } from "../../components/home/ui/navbar/navbar";

export const metadata: Metadata = {
  title: "Novack Redesigning the security",
  description: "Novack is a security company that provides security services.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
