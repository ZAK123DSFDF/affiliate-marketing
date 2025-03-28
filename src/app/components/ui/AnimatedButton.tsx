import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  onClick,
  href,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 overflow-hidden";

  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary/5",
  };

  const sizeClasses = {
    sm: "text-sm px-4 py-1.5",
    md: "px-6 py-2.5",
    lg: "text-lg px-8 py-3",
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (href) {
    return (
      <a href={href} className={buttonClasses} onClick={handleClick}>
        {children}
        <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
      </a>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {children}
      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
    </button>
  );
};

export default AnimatedButton;
