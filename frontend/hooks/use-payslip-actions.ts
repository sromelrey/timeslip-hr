"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  finalizePayslip,
  voidPayslip,
} from "@/store/core/thunks/payroll-thunks";

export function usePayslipActions() {
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleFinalize = async (id: number) => {
    setActionLoading(id);
    try {
      await dispatch(finalizePayslip(id));
    } catch (error) {
      console.error("Failed to finalize payslip:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVoid = async (id: number) => {
    if (!confirm("Are you sure you want to void this payslip?")) {
      return;
    }

    setActionLoading(id);
    try {
      await dispatch(voidPayslip(id));
    } catch (error) {
      console.error("Failed to void payslip:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return {
    handleFinalize,
    handleVoid,
    formatCurrency,
    formatMinutes,
    actionLoading,
  };
}
