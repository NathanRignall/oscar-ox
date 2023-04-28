import React from "react";
import Link from "next/link";

// Navbar types
interface NavbarProps {
  loggedIn: boolean;
}

// Navbar Link types
interface NavbarLinkProps {
  href: string;
  text: string;
  active: boolean;
}

// Navbar Link component
const NavbarLink = ({ href, text, active }: NavbarLinkProps) => {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-lg font-medium text-slate-900 hover:border-slate-900"
    >
      {text}
    </Link>
  );
};

// Links for the navbar
const links = [
  { href: "/", text: "Calendar" },
  { href: "/search", text: "Search" },
  { href: "/companies", text: "Companies" },
  { href: "/about", text: "About" },
];

// Navbar component
export const Navbar = ({ loggedIn }: NavbarProps) => {
  return (
    <div className="z-40 bg-white border-b-2 border-slate-200 ">
      <div className="mx-auto max-w-7xl px-2 md:px-6 md:py-2 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="right-0 flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <div className="text-4xl font-bold text-slate-900">Oscar Ox</div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-4">
                {links.map((link) => (
                  <NavbarLink
                    key={link.href}
                    href={link.href}
                    text={link.text}
                    active={link.href === "/"}
                  />
                ))}

                {loggedIn ? (
                  <Link
                    href="/profile"
                    className="rounded-md bg-slate-100 px-3 py-2 text-lg font-medium text-slate-900"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="rounded-md bg-slate-100 px-3 py-2 text-lg font-medium text-slate-900"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
