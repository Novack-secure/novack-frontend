import Link from "next/link";

interface NavbarLinkProps {
  title: string;
  href: string;
}

export const NavbarLink = ({ href, title }: NavbarLinkProps) => {
  return (
    <>
      <Link href={href} className="list-none relative cursor-pointer group">
        <span className="text-white/80 hover:text-[#07D9D9] transition-colors duration-300">
          {title}
        </span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#07D9D9] transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </>
  );
};
