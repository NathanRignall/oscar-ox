import clsx from "clsx";
import Link from "next/link";

export type ButtonLink = {
  className?: string;
  variant?: "primary" | "secondary";
  display?: "inline" | "block";
  size?: "sm" | "md" | "lg";
  href: string;
  children: React.ReactNode;
};

export const ButtonLink = ({
  className,
  variant = "primary",
  display = "inline",
  size = "md",
  href,
  children,
}: ButtonLink) => {
  return (
    <Link
      className={clsx(
        className,
        variant === "primary" &&
          "text-slate-900 bg-white border-slate-200 hover:bg-slate-200 hover:border-slate-400 dark:text-white dark:bg-slate-700 dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700",
        variant === "secondary" &&
          "text-white bg-slate-900 border-slate-700 hover:bg-slate-700 hover:border-slate-500 dark:text-white dark:bg-slate-700 dark:border-slate-500 dark:hover:bg-slate-900 dark:hover:border-slate-700",
        display == "inline" && "inline-block",
        display == "block" && "block",
        size === "sm" && "text-xs px-3 py-2",
        size === "md" && "text-sm px-5 py-3",
        size === "lg" && "text-lg px-6 py-4",
        "font-medium rounded-lg border-2"
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
