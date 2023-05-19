import clsx from "clsx";

export type ButtonProps = {
  id?: string;
  className?: string;
  variant?: "primary" | "secondary";
  display?: "inline" | "block";
  size?: "sm" | "md" | "lg";
  onClick?: (() => void) | ((event: any) => any);
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
};

export const Button = ({
  id,
  className,
  variant = "primary",
  display = "inline",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  active = false,
  children,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={clsx(
        className,

        display == "inline",
        display == "block" && "w-full",
        size === "sm" && "text-xs px-3 py-2",
        size === "md" && "text-sm px-5 py-3",
        size === "lg" && "text-lg px-6 py-4",
        disabled && "cursor-not-allowed opacity-50",
        active && variant === "primary" && "bg-slate-200 border-slate-400",
        active && variant === "secondary" && "bg-slate-700 border-slate-500",
        !active &&
          variant === "primary" &&
          "text-slate-900 bg-white border-slate-200 hover:bg-slate-200 hover:border-slate-400",
        !active &&
          variant === "secondary" &&
          "text-white bg-slate-900 border-slate-700 hover:bg-slate-700 hover:border-slate-500",
        "font-medium rounded-lg border-2"
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
