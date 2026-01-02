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
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { Payslip } from "@/lib/payroll.api";
import { usePayslipActions } from "@/hooks/use-payslip-actions";

interface PayslipTableProps {
  payslips: Payslip[];
  loading: boolean;
}

export function PayslipTable({ payslips, loading }: PayslipTableProps) {
  const {
    handleFinalize,
    handleVoid,
    formatCurrency,
    formatMinutes,
    actionLoading,
  } = usePayslipActions();

  if (loading && payslips.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (payslips.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No payslips found. Generate payslips for a pay period to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Gross Pay</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payslips.map((payslip) => (
            <TableRow key={payslip.id}>
              <TableCell className="font-medium">
                {payslip.employee
                  ? `${payslip.employee.firstName} ${payslip.employee.lastName}`
                  : `#${payslip.employeeId}`}
              </TableCell>
              <TableCell>
                {payslip.payPeriod
                  ? `${format(new Date(payslip.payPeriod.startDate), "MMM d")} - ${format(new Date(payslip.payPeriod.endDate), "MMM d")}`
                  : "-"}
              </TableCell>
              <TableCell>
                {formatMinutes(payslip.totalRegularMinutes)}
              </TableCell>
              <TableCell>{formatCurrency(payslip.grossPay)}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(payslip.netPay)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    payslip.status === "FINALIZED"
                      ? "default"
                      : payslip.status === "VOID"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {payslip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {payslip.status === "DRAFT" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFinalize(payslip.id)}
                      disabled={actionLoading === payslip.id}
                    >
                      {actionLoading === payslip.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Finalize
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleVoid(payslip.id)}
                      disabled={actionLoading === payslip.id}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Void
                    </Button>
                  </>
                )}
                {payslip.status === "FINALIZED" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleVoid(payslip.id)}
                    disabled={actionLoading === payslip.id}
                  >
                    {actionLoading === payslip.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Void
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

