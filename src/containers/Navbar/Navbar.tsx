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
  { href: "/", text: "Calander" },
  { href: "/search", text: "Search" },
  { href: "/companies", text: "Companies" },
];

// Navbar component
export const Navbar = ({ loggedIn }: NavbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b-2  border-slate-200 ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 sm:py-2 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="right-0 flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="text-4xl font-bold text-slate-900">Oscar Ox</div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden sm:ml-6 sm:block">
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
                    href="/account"
                    className="rounded-md bg-slate-100 px-3 py-2 text-lg font-medium text-slate-900"
                  >
                    Account
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
