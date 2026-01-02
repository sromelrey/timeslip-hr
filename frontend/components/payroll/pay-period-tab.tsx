"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { fetchPayPeriods } from "@/store/core/thunks/payroll-thunks";
import { PayPeriodTable } from "./pay-period-table";
import { CreatePayPeriodDialog } from "./create-pay-period-dialog";

export function PayPeriodTab() {
  const dispatch = useAppDispatch();
  const { payPeriods, loading, error } = useAppSelector((state) => state.payroll);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPayPeriods());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPayPeriods());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Pay Periods</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage payroll periods
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Pay Period
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <PayPeriodTable payPeriods={payPeriods} loading={loading} />

      <CreatePayPeriodDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
