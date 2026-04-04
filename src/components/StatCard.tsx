import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const variantClasses = {
  default: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive animate-pulse-red',
};

export function StatCard({ title, value, icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className="glass-card neo-shadow p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold mt-1 ${variantClasses[variant]}`}>{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-secondary ${variantClasses[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
