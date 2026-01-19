"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeductionTable } from "./deduction-table";
import { DeductionDialog } from "./deduction-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDeductions } from "@/store/core/thunks/deduction-thunks";
import { fetchEmployees } from "@/store/core/thunks/employee-thunks";
import type { Deduction } from "@/lib/deduction.api";

export function DeductionTab() {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<Deduction | null>(null);
  
  const deductions = useAppSelector((state) => state.deduction.deductions);
  const loading = useAppSelector((state) => state.deduction.loading);

  // Fetch deductions and employees on mount
  useEffect(() => {
    dispatch(fetchDeductions());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleEdit = (deduction: Deduction) => {
    setSelectedDeduction(deduction);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setSelectedDeduction(null);
    dispatch(fetchDeductions()); // Refresh list
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedDeduction(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Deductions</h2>
          <p className="text-muted-foreground text-sm">
            Manage tax, SSS, PhilHealth, Pag-IBIG, loans, and other deductions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Deduction
        </Button>
      </div>

      <DeductionTable
        deductions={deductions}
        loading={loading}
        onEdit={handleEdit}
      />

      <DeductionDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        deduction={selectedDeduction}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
