"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Download } from "lucide-react";
import {
  fetchPayPeriods,
  fetchPayslips,
} from "@/store/core/thunks/payroll-thunks";
import { exportPayslipsZip } from "@/lib/payroll.api";
import { PayslipTable } from "./payslip-table";
import { GeneratePayslipsDialog } from "./generate-payslips-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PayslipTab() {
  const dispatch = useAppDispatch();
  const { payPeriods, payslips, loading, error } = useAppSelector(
    (state) => state.payroll
  );
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchPayPeriods());
    dispatch(fetchPayslips());
  }, [dispatch]);

  const handleRefresh = () => {
    const periodId = selectedPeriod === "all" ? undefined : parseInt(selectedPeriod);
    dispatch(fetchPayslips(periodId));
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const periodId = value === "all" ? undefined : parseInt(value);
    dispatch(fetchPayslips(periodId));
  };

  const handleExportZip = async () => {
    if (selectedPeriod === "all") return;
    try {
      const blob = await exportPayslipsZip(parseInt(selectedPeriod));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslips-period-${selectedPeriod}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to export ZIP:', error);
      alert('Failed to export ZIP'); // Simple alert for now
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Payslips</h2>
          <p className="text-sm text-muted-foreground">
            Generate and manage employee payslips
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {payPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id.toString()}>
                  {new Date(period.startDate).toLocaleDateString()} -{" "}
                  {new Date(period.endDate).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportZip}
            disabled={loading || selectedPeriod === "all"}
            title={selectedPeriod === "all" ? "Select a period to export" : "Export all payslips as ZIP"}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button size="sm" onClick={() => setGenerateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Payslips
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <PayslipTable payslips={payslips} loading={loading} />

      <GeneratePayslipsDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        payPeriods={payPeriods}
      />
    </div>
  );
}
