import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeoPillProps extends HTMLMotionProps<"div"> {
  children?: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  inset?: boolean;
}

export function NeoPill({ children, icon, active, inset, className, ...props }: NeoPillProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium",
        inset ? "neo-inset" : active ? "neo-pressed text-accent" : "neo-pill",
        className
      )}
      {...props}
    >
      {icon && <span className="text-accent">{icon}</span>}
      <span className="text-foreground">{children}</span>
    </motion.div>
  );
}
