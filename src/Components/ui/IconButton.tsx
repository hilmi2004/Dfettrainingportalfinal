
import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const IconButton = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: IconButtonProps) => {
  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "p-2.5 text-base",
  };

  const variantClasses = {
    primary: "bg-teach-blue-500 text-white hover:bg-teach-blue-600",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teach-blue-500/30",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children && <span className="ml-2">{children}</span>}
    </button>
  );
};

export default IconButton;
