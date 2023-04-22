import Link from "next/link";
import clsx from "clsx";

export type TagProps = {
  className?: string;
  variant?: "primary" | "secondary" | "blue" | "green" | "red" | "yellow";
  color?: string;
  text: string;
  href?: string;
};

export const Tag = ({
  className,
  variant,
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
          "text-sm  px-3 py-0.5 rounded-lg inline-block"
        )}
        style={{ backgroundColor: color, color: "white" }}
      >
        {text}
      </span>
    );
  } else {
    return (
      <Link
        className={clsx(
          className,
          "text-sm text-slate-100 bg-slate-900 px-3 py-1 rounded-lg block"
        )}
        style={{ backgroundColor: color }}
        href={href}
      >
        {text}
      </Link>
    );
  }
};
