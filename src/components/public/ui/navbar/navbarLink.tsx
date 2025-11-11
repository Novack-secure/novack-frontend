import Link from "next/link";

interface NavbarLinkProps {
  title: string;
  href: string;
}

export const NavbarLink = ({ href, title }: NavbarLinkProps) => {
  return (
    <Link 
      href={href} 
      className="relative cursor-pointer group py-2 px-1"
    >
      <span className="text-white/80 hover:text-[#0386D9] transition-colors duration-300 text-sm md:text-base">
        {title}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0386D9] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};
