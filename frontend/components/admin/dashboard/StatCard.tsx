import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  className?: string;
}

export function StatCard({ name, value, icon: Icon, color, bg, className }: StatCardProps) {
  return (
    <div className={cn("p-6 bg-card border border-border rounded-xl shadow-sm", className)}>
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-lg", bg, color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
