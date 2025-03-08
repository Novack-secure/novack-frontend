import Link from "next/link";

interface NavbarMobileLinkProps {
  title: string;
  href: string;
}

export const NavbarMobileLink = ({ title, href }: NavbarMobileLinkProps) => {
  return (
    <Link href={href} className="flex items-center list-none">
      <span className="w-2 h-2 rounded-full bg-primary mr-2 transition-all duration-300"></span>
      <span className="text-lg hover:text-primary transition-colors duration-300">
        {title}
      </span>
    </Link>
  );
};
