import Link from "next/link";
import clsx from "clsx";

export type TagProps = {
  className?: string;
  color?: string;
  text: string;
  href: string;
};

export const Tag = ({
  className,
  color = "rgb(15 23 42 / var(--tw-text-opacity))",
  text,
  href,
}: TagProps) => {
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
};
