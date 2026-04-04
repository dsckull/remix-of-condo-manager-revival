import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeoDiscProps extends HTMLMotionProps<"div"> {
  children?: ReactNode;
  active?: boolean;
  inset?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
}

export function NeoDisc({ children, active, inset, size = "md", className, ...props }: NeoDiscProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
    hero: "w-40 h-40"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "flex items-center justify-center rounded-full text-primary",
        sizeClasses[size],
        inset ? "neo-inset" : active ? "neo-pressed text-accent" : "neo-disc",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
