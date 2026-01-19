"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  closePayPeriod,
  reopenPayPeriod,
} from "@/store/core/thunks/payroll-thunks";

export function usePayPeriodActions() {
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleClose = async (id: number) => {
    setActionLoading(id);
    try {
      await dispatch(closePayPeriod(id));
    } catch (error) {
      console.error("Failed to close pay period:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReopen = async (id: number) => {
    setActionLoading(id);
    try {
      await dispatch(reopenPayPeriod(id));
    } catch (error) {
      console.error("Failed to reopen pay period:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return {
    handleClose,
    handleReopen,
    actionLoading,
  };
}
