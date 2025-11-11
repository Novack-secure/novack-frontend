import type { Metadata } from "next";

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
