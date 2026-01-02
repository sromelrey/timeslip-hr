"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import {
  fetchPayPeriods,
  fetchPayslips,
} from "@/store/core/thunks/payroll-thunks";
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
