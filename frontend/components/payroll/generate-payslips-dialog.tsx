"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePayslips } from "@/store/core/thunks/payroll-thunks";
import { Loader2 } from "lucide-react";
import type { PayPeriod } from "@/lib/payroll.api";

interface GeneratePayslipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payPeriods: PayPeriod[];
}

export function GeneratePayslipsDialog({
  open,
  onOpenChange,
  payPeriods,
}: GeneratePayslipsDialogProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPeriod) {
      setError("Please select a pay period");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(
        generatePayslips({ payPeriodId: parseInt(selectedPeriod) })
      );
      onOpenChange(false);
      setSelectedPeriod("");
      alert(`Successfully generated payslips`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate payslips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Payslips</DialogTitle>
          <DialogDescription>
            Generate payslips for all employees in the selected pay period
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payPeriod">Pay Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="payPeriod">
                <SelectValue placeholder="Select a pay period" />
              </SelectTrigger>
              <SelectContent>
                {payPeriods.map((period) => (
                  <SelectItem key={period.id} value={period.id.toString()}>
                    {new Date(period.startDate).toLocaleDateString()} -{" "}
                    {new Date(period.endDate).toLocaleDateString()} (
                    {period.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !selectedPeriod}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
