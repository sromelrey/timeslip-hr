"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Loader2, Download } from "lucide-react";
import type { Payslip } from "@/lib/payroll.api";
import { usePayslipActions } from "@/hooks/use-payslip-actions";
import { useState } from "react";

interface PayslipTableProps {
  payslips: Payslip[];
  loading: boolean;
}

export function PayslipTable({ payslips, loading }: PayslipTableProps) {
  const {
    handleFinalize,
    handleVoid,
    handleDownloadPdf,
    formatCurrency,
    formatMinutes,
    actionLoading,
    pdfLoading,
  } = usePayslipActions();

  const [confirmFinalizeId, setConfirmFinalizeId] = useState<number | null>(null);

  const executeFinalize = async () => {
    if (confirmFinalizeId) {
      await handleFinalize(confirmFinalizeId);
      setConfirmFinalizeId(null);
    }
  };

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
                      onClick={() => setConfirmFinalizeId(payslip.id)}
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
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPdf(payslip.id)}
                      disabled={pdfLoading === payslip.id}
                    >
                      {pdfLoading === payslip.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      PDF
                    </Button>
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
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!confirmFinalizeId} onOpenChange={(open) => !open && setConfirmFinalizeId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Payslip?</DialogTitle>
            <DialogDescription className="space-y-3 pt-3">
              <p>Are you sure you want to finalize this payslip?</p>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md text-sm border border-amber-200 dark:border-amber-900/20">
                <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1 flex items-center">
                   ⚠️ Usage Warning:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-amber-700 dark:text-amber-300">
                  <li>This action is <strong>permanent</strong> and cannot be undone.</li>
                  <li>The payslip will be locked and can no longer be edited or regenerated.</li>
                  <li>Any future corrections will require voiding this record entirely.</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmFinalizeId(null)}>
              Cancel
            </Button>
            <Button onClick={executeFinalize}>
              Confirm Finalize
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

