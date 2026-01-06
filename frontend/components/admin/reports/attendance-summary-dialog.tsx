"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useReportActions } from "@/hooks/use-report-actions";
import { Loader2 } from "lucide-react";

interface AttendanceSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceSummaryDialog({ open, onOpenChange }: AttendanceSummaryDialogProps) {
  const { generateAttendanceSummary, loading, error } = useReportActions();
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [includeAnomalies, setIncludeAnomalies] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      return; // Form validation
    }

    const success = await generateAttendanceSummary({
      startDate,
      endDate,
      includeAnomalies,
      sortOrder,
    });

    if (success) {
      onOpenChange(false);
      // Reset form
      setStartDate("");
      setEndDate("");
      setIncludeAnomalies(true);
      setSortOrder("asc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Attendance Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date *</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date *</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* Include Anomalies */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anomalies"
              checked={includeAnomalies}
              onCheckedChange={(checked) => setIncludeAnomalies(checked as boolean)}
            />
            <Label htmlFor="anomalies" className="cursor-pointer">
              Include anomaly indicators
            </Label>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <RadioGroup value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asc" id="asc-att" />
                <Label htmlFor="asc-att">Ascending (by date)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desc" id="desc-att" />
                <Label htmlFor="desc-att">Descending (by date)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !startDate || !endDate}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
