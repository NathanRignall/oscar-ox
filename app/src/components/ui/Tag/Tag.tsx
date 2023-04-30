import Link from "next/link";
import clsx from "clsx";
import fontColorContrast from "font-color-contrast";

export type TagProps = {
  className?: string;
  variant?: "primary" | "secondary" | "blue" | "green" | "red" | "yellow";
  size?: "sm" | "md" | "lg";
  color?: string;
  text: string;
  href?: string;
};

export const Tag = ({
  className,
  variant,
  size = "md",
  color,
  text,
  href,
}: TagProps) => {
  if (!href) {
    return (
      <span
        className={clsx(
          className,
          variant == "primary" && "text-slate-900 bg-white",
          variant == "secondary" && "text-white bg-slate-900",
          variant == "blue" && "text-blue-900 bg-blue-100",
          variant == "green" && "text-green-900 bg-green-100",
          variant == "red" && "text-red-900 bg-red-100",
          variant == "yellow" && "text-yellow-900 bg-yellow-100",
          size == "sm" && "text-sm px-3 py-0.5",
          size == "md" && "text-sm px-3 py-1",
          size == "lg" && "text-sm px-4 py-1.5",
          "rounded-lg inline-block"
        )}
        style={{ backgroundColor: color, color: color && fontColorContrast(color), }}
      >
        {text}
      </span>
    );
  } else {
    return (
      <Link
        className={clsx(
          className,
          variant == "primary" && "text-slate-900 bg-white",
          variant == "secondary" && "text-white bg-slate-900",
          variant == "blue" && "text-blue-900 bg-blue-100",
          variant == "green" && "text-green-900 bg-green-100",
          variant == "red" && "text-red-900 bg-red-100",
          variant == "yellow" && "text-yellow-900 bg-yellow-100",
          size == "sm" && "text-sm px-3 py-0.5",
          size == "md" && "text-sm px-3 py-1",
          size == "lg" && "text-sm px-4 py-1.5",
          "text-sm rounded-lg inline-block"
        )}
        style={{ backgroundColor: color, color: color && fontColorContrast(color), }}
        href={href}
      >
        {text}
      </Link>
    );
  }
};