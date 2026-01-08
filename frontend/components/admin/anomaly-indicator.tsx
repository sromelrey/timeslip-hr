import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AnomalyType =
  | "missing_break"
  | "excessive_overtime"
  | "incomplete_day"
  | "invalid_sequence"
  | "late_arrival"
  | "early_departure";

export type AnomalySeverity = "warning" | "danger" | "info";

interface AnomalyConfig {
  label: string;
  description: string;
  severity: AnomalySeverity;
  icon: typeof AlertTriangle;
  quickFixLabel?: string;
}

const ANOMALY_CONFIGS: Record<AnomalyType, AnomalyConfig> = {
  missing_break: {
    label: "Missing Break",
    description: "Worked more than 6 hours without a recorded break.",
    severity: "warning",
    icon: Clock,
    quickFixLabel: "Apply Standard Break",
  },
  excessive_overtime: {
    label: "Excessive Overtime",
    description: "Overtime hours exceed the daily threshold.",
    severity: "warning",
    icon: AlertTriangle,
    quickFixLabel: "Review Overtime",
  },
  incomplete_day: {
    label: "Incomplete Day",
    description: "Missing clock out for this day.",
    severity: "danger",
    icon: AlertCircle,
    quickFixLabel: "Add Clock Out",
  },
  invalid_sequence: {
    label: "Invalid Sequence",
    description: "Time events are not in the expected order.",
    severity: "danger",
    icon: AlertCircle,
    quickFixLabel: "Review Events",
  },
  late_arrival: {
    label: "Late Arrival",
    description: "Clocked in after the scheduled start time.",
    severity: "info",
    icon: Info,
  },
  early_departure: {
    label: "Early Departure",
    description: "Clocked out before the scheduled end time.",
    severity: "info",
    icon: Info,
  },
};

const SEVERITY_STYLES: Record<AnomalySeverity, string> = {
  warning:
    "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  danger:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  info: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
};

interface AnomalyIndicatorProps {
  type: AnomalyType;
  showLabel?: boolean;
  showQuickFix?: boolean;
  onQuickFix?: () => void;
  className?: string;
}

/**
 * AnomalyIndicator - Displays a badge for timesheet anomalies with optional quick-fix action
 * 
 * @example
 * <AnomalyIndicator 
 *   type="missing_break" 
 *   showLabel 
 *   showQuickFix 
 *   onQuickFix={() => openQuickFixDialog('missing_break', timesheetId)} 
 * />
 */
export function AnomalyIndicator({
  type,
  showLabel = true,
  showQuickFix = false,
  onQuickFix,
  className,
}: AnomalyIndicatorProps) {
  const config = ANOMALY_CONFIGS[type];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 group", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border cursor-help",
          SEVERITY_STYLES[config.severity]
        )}
        title={config.description}
      >
        <Icon className="h-3 w-3" />
        {showLabel && <span>{config.label}</span>}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-48 text-center border hidden group-hover:block">
        {config.description}
      </div>

      {showQuickFix && config.quickFixLabel && onQuickFix && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onQuickFix}
        >
          {config.quickFixLabel}
        </Button>
      )}
    </div>
  );
}

interface AnomalyListProps {
  anomalies: AnomalyType[];
  onQuickFix?: (type: AnomalyType) => void;
  className?: string;
}

/**
 * AnomalyList - Displays multiple anomaly indicators
 */
export function AnomalyList({ anomalies, onQuickFix, className }: AnomalyListProps) {
  if (anomalies.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {anomalies.map((type) => (
        <AnomalyIndicator
          key={type}
          type={type}
          showQuickFix={!!onQuickFix}
          onQuickFix={onQuickFix ? () => onQuickFix(type) : undefined}
        />
      ))}
    </div>
  );
}

/**
 * Get the count of anomalies by severity
 */
export function getAnomalySeverityCounts(anomalies: AnomalyType[]): Record<AnomalySeverity, number> {
  const counts: Record<AnomalySeverity, number> = { warning: 0, danger: 0, info: 0 };
  
  for (const type of anomalies) {
    const severity = ANOMALY_CONFIGS[type].severity;
    counts[severity]++;
  }
  
  return counts;
}
