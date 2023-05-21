"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileNavigationLinkProps {
  href: string;
  text: string;
  active: boolean;
}

export const ProfileNavigation = () => {
  const pathname = usePathname();
  return (
    <div className="xl:absolute mb-6 max-w-3xl mx-auto">
      <ul className="xl:w-48 w-full rounded-lg block sm:flex xl:block justify-between overflow-hidden bg-white dark:bg-slate-700">
        <li className="grow">
          <Link
            href="/profile"
            className={clsx(
              "/profile" == pathname && "bg-slate-200 dark:bg-slate-600",
              "inline-flex items-center w-full px-5 py-3 text-sm font-medium border-t-2 border-b border-x-2 sm:border-y-2 sm:border-l-2 sm:border-r xl:border-t-2 xl:border-b xl:border-x-2 rounded-b-none rounded-lg sm:rounded-none sm:rounded-l-lg xl:rounded-b-none xl:rounded-lg text-slate-900 border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
            )}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2 fill-current"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              ></path>
            </svg>
            Profile
          </Link>
        </li>
        <li className="grow">
          <Link
            href="/profile/responses"
            className={clsx(
              "/profile/responses" == pathname &&
                "bg-slate-200 dark:bg-slate-600",
              "inline-flex items-center w-full px-5 py-3 text-sm font-medium border-y border-x-2 sm:border-y-2 sm:border-x xl:border-y xl:border-x-2 text-slate-900 border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
            )}
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-4 h-4 mr-2 fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Responses
          </Link>
        </li>
        <li className="grow">
          <Link
            href="/profile/settings"
            className={clsx(
              "/profile/settings" == pathname &&
                "bg-slate-200 dark:bg-slate-600",
              "inline-flex items-center w-full px-5 py-3 text-sm font-medium border-y border-x-2 sm:border-y-2 sm:border-x xl:border-y xl:border-x-2 text-slate-900 border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
            )}
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-4 h-4 mr-2 fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
            Settings
          </Link>
        </li>
        <li className="grow">
          <Link
            href="/profile/admin"
            className={clsx(
              "/profile/admin" == pathname && "bg-slate-200 dark:bg-slate-600",
              "inline-flex items-center w-full px-5 py-3 text-sm font-medium border-t border-b-2 border-x-2 sm:border-y-2 sm:border-l sm:border-r-2 xl:border-t xl:border-b-2 xl:border-x-2 rounded-t-none rounded-lg sm:rounded-none sm:rounded-r-lg xl:rounded-t-none xl:rounded-lg text-slate-900 border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700"
            )}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 mr-2 fill-current"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
            Admin
          </Link>
        </li>
      </ul>
    </div>
  );
};
