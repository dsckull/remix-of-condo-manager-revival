import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ title, value, prefix = "", suffix = "", icon, className }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(value);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("neo-raised rounded-3xl p-6 flex flex-col min-w-[200px]", className)}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-accent neo-inset-sm p-2 rounded-full">{icon}</div>}
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold tracking-tight text-primary">
          {prefix}{displayValue.toLocaleString("pt-BR")}{suffix}
        </div>
      </div>
    </motion.div>
  );
}
