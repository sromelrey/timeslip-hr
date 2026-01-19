"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  createDeduction,
  updateDeductionThunk,
  deleteDeduction,
} from "@/store/core/thunks/deduction-thunks";
import type { CreateDeductionDto, UpdateDeductionDto } from "@/lib/deduction.api";

export function useDeductionActions() {
  const dispatch = useAppDispatch();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleCreate = async (dto: CreateDeductionDto) => {
    setActionLoading(-1); // Use -1 for create action
    try {
      await dispatch(createDeduction(dto));
    } catch (error) {
      console.error("Failed to create deduction:", error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async (id: number, dto: UpdateDeductionDto) => {
    setActionLoading(id);
    try {
      await dispatch(updateDeductionThunk(id, dto));
    } catch (error) {
      console.error("Failed to update deduction:", error);
      throw error;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this deduction?")) {
      return;
    }

    setActionLoading(id);
    try {
      await dispatch(deleteDeduction(id));
    } catch (error) {
      console.error("Failed to delete deduction:", error);
      throw error;
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

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    formatCurrency,
    actionLoading,
  };
}
