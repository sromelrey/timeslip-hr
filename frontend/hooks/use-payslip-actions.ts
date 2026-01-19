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
  const [pdfLoading, setPdfLoading] = useState<number | null>(null);

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

  const handleDownloadPdf = async (id: number) => {
    setPdfLoading(id);
    try {
      const { downloadPayslipPdf } = await import("@/lib/payroll.api");
      const blob = await downloadPayslipPdf(id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setPdfLoading(null);
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
    handleDownloadPdf,
    formatCurrency,
    formatMinutes,
    actionLoading,
    pdfLoading,
  };
}
