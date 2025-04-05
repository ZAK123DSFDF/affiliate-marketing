import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  iconClassName,
  hoverEffect = true,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "glass-card p-6 rounded-2xl transition-all duration-300",
        hoverEffect && "hover:shadow-md hover:translate-y-[-2px]",
        onClick && "cursor-pointer",
        "group",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary transition-transform duration-300 group-hover:scale-110",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
