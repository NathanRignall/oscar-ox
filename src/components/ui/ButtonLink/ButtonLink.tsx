import clsx from "clsx";
import Link from "next/link";

export type ButtonLink = {
  className?: string;
  variant?: "primary" | "secondary";
  display?: "inline" | "block";
  href: string;
  children: React.ReactNode;
};

export const ButtonLink = ({
  className,
  variant = "primary",
  display = "inline",
  href,
  children,
}: ButtonLink) => {
  return (
    <Link
      className={clsx(
        className,
        variant === "primary" &&
          "text-slate-900 bg-white border-slate-200 hover:bg-slate-200 hover:border-slate-400",
        variant === "secondary" &&
          "text-white bg-slate-900 border-slate-700 hover:bg-slate-700 hover:border-slate-500",
        display == "inline",
        display == "block" && "w-full",
        "text-sm font-medium rounded-lg px-5 py-3 border-2 inline-block"
      )}
      href={href}
    >
      {children}
    </Link>
  );
};
