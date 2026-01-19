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
import { Lock, LockOpen, Loader2 } from "lucide-react";
import type { PayPeriod } from "@/lib/payroll.api";
import { usePayPeriodActions } from "@/hooks/use-pay-period-actions";

interface PayPeriodTableProps {
  payPeriods: PayPeriod[];
  loading: boolean;
}

export function PayPeriodTable({ payPeriods, loading }: PayPeriodTableProps) {
  const { handleClose, handleReopen, actionLoading } = usePayPeriodActions();

  if (loading && payPeriods.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (payPeriods.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No pay periods found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Closed At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payPeriods.map((period) => (
            <TableRow key={period.id}>
              <TableCell className="font-medium">
                {format(new Date(period.startDate), "MMM d")} -{" "}
                {format(new Date(period.endDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{format(new Date(period.startDate), "PP")}</TableCell>
              <TableCell>{format(new Date(period.endDate), "PP")}</TableCell>
              <TableCell>
                <Badge
                  variant={period.status === "OPEN" ? "secondary" : "default"}
                >
                  {period.status}
                </Badge>
              </TableCell>
              <TableCell>
                {period.closedAt
                  ? format(new Date(period.closedAt), "PP p")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                {period.status === "OPEN" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClose(period.id)}
                    disabled={actionLoading === period.id}
                  >
                    {actionLoading === period.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Close
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReopen(period.id)}
                    disabled={actionLoading === period.id}
                  >
                    {actionLoading === period.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LockOpen className="w-4 h-4 mr-2" />
                    )}
                    Reopen
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

