"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { AnomalyType } from "./anomaly-indicator";

interface QuickFixConfig {
  title: string;
  description: string;
  suggestedAction: string;
  field: "REGULAR" | "BREAK" | "OVERTIME";
  mode: "DELTA" | "OVERRIDE";
  defaultMinutes: number;
  defaultReason: string;
}

const QUICK_FIX_CONFIGS: Record<AnomalyType, QuickFixConfig> = {
  missing_break: {
    title: "Add Standard Break",
    description: "Apply a standard 60-minute break to this day.",
    suggestedAction: "This will add 60 minutes to the break time.",
    field: "BREAK",
    mode: "DELTA",
    defaultMinutes: 60,
    defaultReason: "Applied standard break - employee forgot to log break",
  },
  excessive_overtime: {
    title: "Review Overtime",
    description: "Adjust the overtime hours for this day.",
    suggestedAction: "Review and confirm the overtime is accurate, or adjust as needed.",
    field: "OVERTIME",
    mode: "OVERRIDE",
    defaultMinutes: 0,
    defaultReason: "Overtime reviewed and adjusted per company policy",
  },
  incomplete_day: {
    title: "Add Clock Out",
    description: "This day is missing a clock out event.",
    suggestedAction: "Add the missing work hours based on expected schedule.",
    field: "REGULAR",
    mode: "OVERRIDE",
    defaultMinutes: 480, // 8 hours
    defaultReason: "Added missing clock out - employee forgot to clock out",
  },
  invalid_sequence: {
    title: "Fix Time Sequence",
    description: "Time events are not in the expected order.",
    suggestedAction: "Review and correct the time entries for this day.",
    field: "REGULAR",
    mode: "OVERRIDE",
    defaultMinutes: 480,
    defaultReason: "Corrected invalid time sequence",
  },
  late_arrival: {
    title: "Acknowledge Late Arrival",
    description: "Employee arrived late on this day.",
    suggestedAction: "No adjustment needed - for record keeping only.",
    field: "REGULAR",
    mode: "DELTA",
    defaultMinutes: 0,
    defaultReason: "Late arrival acknowledged - no time adjustment",
  },
  early_departure: {
    title: "Acknowledge Early Departure",
    description: "Employee left early on this day.",
    suggestedAction: "No adjustment needed - for record keeping only.",
    field: "REGULAR",
    mode: "DELTA",
    defaultMinutes: 0,
    defaultReason: "Early departure acknowledged - no time adjustment",
  },
};

interface QuickFixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anomalyType: AnomalyType | null;
  dayId: number;
  workDate: string;
  onApply: (
    dayId: number,
    adjustment: {
      field: "REGULAR" | "BREAK" | "OVERTIME";
      mode: "DELTA" | "OVERRIDE";
      minutes: number;
      reason: string;
    }
  ) => Promise<void>;
}

export function QuickFixDialog({
  open,
  onOpenChange,
  anomalyType,
  dayId,
  workDate,
  onApply,
}: QuickFixDialogProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [customReason, setCustomReason] = useState("");

  if (!anomalyType) return null;

  const config = QUICK_FIX_CONFIGS[anomalyType];

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(dayId, {
        field: config.field,
        mode: config.mode,
        minutes: config.defaultMinutes,
        reason: customReason || config.defaultReason,
      });
      setCustomReason("");
      onOpenChange(false);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Anomaly Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground mb-1">Work Date</p>
            <p className="font-medium">{workDate}</p>
          </div>

          {/* Suggested Action */}
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Suggested Action
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  {config.suggestedAction}
                </p>
              </div>
            </div>
          </div>

          {/* Adjustment Details */}
          <div className="space-y-2">
            <p className="text-sm font-medium">This will apply:</p>
            <ul className="text-sm text-muted-foreground list-disc ml-4 space-y-1">
              <li>Field: {config.field}</li>
              <li>
                {config.mode === "DELTA"
                  ? `Add ${config.defaultMinutes} minutes`
                  : `Set to ${config.defaultMinutes} minutes (${(config.defaultMinutes / 60).toFixed(1)}h)`}
              </li>
            </ul>
          </div>

          {/* Custom Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional override)</Label>
            <Textarea
              id="reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder={config.defaultReason}
              className="resize-none"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use the default reason above.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying}>
            {isApplying ? (
              "Applying..."
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply Quick Fix
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
