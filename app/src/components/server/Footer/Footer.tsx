import Link from "next/link";
import { Tag } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl md:text-4xl font-bold whitespace-nowrap text-slate-900">
              Oscar Ox
            </span>
            <div className="ml-2">
              {process.env.NEXT_PUBLIC_STAGE === "dev" && (
                <Tag variant="red" text="Dev" size="sm" />
              )}
              {process.env.NEXT_PUBLIC_STAGE === "alpha" && (
                <Tag variant="green" text="Alpha" size="sm" />
              )}
              {process.env.NEXT_PUBLIC_STAGE === "beta" && (
                <Tag variant="blue" text="Beta" size="sm" />
              )}
            </div>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-slate-500 sm:mb-0 ">
            <li>
              <Link href="/about" className="mr-4 hover:underline md:mr-6 ">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/about/privacy"
                className="mr-4 hover:underline md:mr-6"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/about/documentation"
                className="mr-4 hover:underline md:mr-6 "
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/about/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-slate-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-slate-500 sm:text-center">
          © 2023{" "}
          <Link href="/" className="hover:underline">
            Oscar Ox
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
