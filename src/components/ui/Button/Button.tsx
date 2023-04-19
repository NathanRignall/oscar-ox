import clsx from "clsx";

export type ButtonProps = {
  className?: string;
  variant?: "primary" | "secondary";
  display?: "inline" | "block";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
};

export const Button = ({
  className,
  variant = "primary",
  display = "inline",
  onClick,
  type = "button",
  disabled = false,
  children,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        variant === "primary" &&
          "text-slate-900 bg-white border-slate-200 hover:bg-slate-200 hover:border-slate-400",
        variant === "secondary" &&
          "text-white bg-slate-900 border-slate-700 hover:bg-slate-700 hover:border-slate-500",
        display == "inline",
        display == "block" && "w-full",
        disabled && "cursor-not-allowed opacity-50",
        "text-sm font-medium rounded-lg px-5 py-3 border-2"
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
