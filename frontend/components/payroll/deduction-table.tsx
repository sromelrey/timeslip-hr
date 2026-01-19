"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Edit, Trash2, Loader2 } from "lucide-react";
import type { Deduction } from "@/lib/deduction.api";
import { useDeductionActions } from "@/hooks/use-deduction-actions";

interface DeductionTableProps {
  deductions: Deduction[];
  loading: boolean;
  onEdit: (deduction: Deduction) => void;
}

export function DeductionTable({ deductions, loading, onEdit }: DeductionTableProps) {
  const { handleDelete, formatCurrency, actionLoading } = useDeductionActions();

  if (loading && deductions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (deductions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No deductions found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Calculation</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Effective Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deductions.map((deduction) => (
            <TableRow key={deduction.id}>
              <TableCell className="font-medium">
                {deduction.employee
                  ? `${deduction.employee.firstName} ${deduction.employee.lastName} (#${deduction.employee.employeeNumber})`
                  : `Employee #${deduction.employeeId}`}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{deduction.type}</Badge>
              </TableCell>
              <TableCell>{deduction.label}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    deduction.calculationType === "FIXED"
                      ? "secondary"
                      : "default"
                  }
                >
                  {deduction.calculationType}
                </Badge>
              </TableCell>
              <TableCell>
                {deduction.calculationType === "FIXED"
                  ? formatCurrency(deduction.amount)
                  : `${deduction.amount}%`}
              </TableCell>
              <TableCell className="text-sm">
                {deduction.effectiveFrom || deduction.effectiveUntil ? (
                  <>
                    {deduction.effectiveFrom
                      ? format(new Date(deduction.effectiveFrom), "PP")
                      : "—"}
                    {" → "}
                    {deduction.effectiveUntil
                      ? format(new Date(deduction.effectiveUntil), "PP")
                      : "—"}
                  </>
                ) : (
                  "No date range"
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={deduction.isActive ? "default" : "secondary"}
                >
                  {deduction.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(deduction)}
                  disabled={actionLoading === deduction.id}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(deduction.id)}
                  disabled={actionLoading === deduction.id}
                >
                  {actionLoading === deduction.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
