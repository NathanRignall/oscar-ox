import clsx from "clsx";

export type ButtonProps = {
  className?: string;
  variant?: "primary" | "secondary";
  display?: "inline" | "block";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const Button = ({
  className,
  variant = "primary",
  display = "inline",
  onClick,
  disabled = false,
  children,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        variant === "primary" && "text-slate-900 bg-white border-slate-200",
        variant === "secondary" && "text-white bg-gray-800",
        display == "inline",
        display == "block" && "w-full",
        disabled && "cursor-not-allowed opacity-50",
        "text-sm font-medium rounded-lg px-5 py-3 border-2"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
