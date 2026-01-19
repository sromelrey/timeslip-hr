"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Payslip } from "@/lib/payroll.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadPayslipPdf } from "@/lib/payroll.api";

export default function EmployeePayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPayslips = async () => {
      try {
        const response = await api.get("/payroll/my-payslips");
        setPayslips(response.data);
      } catch (err) {
        console.error("Failed to fetch payslips:", err);
        setError("Failed to load your payslips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayslips();
  }, []);

  const handleDownload = async (id: number) => {
    try {
      const blob = await downloadPayslipPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download payslip PDF");
    }
  };

  const formatCurrency = (amount: number, currency?: string | null) => {
    const curr = currency || "PHP";
    const symbol = curr === "PHP" ? "₱" : curr;
    return `${symbol} ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your payslips...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Payslips</h1>
        <p className="text-muted-foreground mt-2">
          View and download your official payslips for each pay period.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6 text-destructive">{error}</CardContent>
        </Card>
      )}

      {!error && payslips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No payslips found yet.</p>
            <p className="text-sm">Once your payroll is processed, you will see your records here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payslip History</CardTitle>
            <CardDescription>
              A history of all payslips generated for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">
                      {payslip.payPeriod ? (
                        <>
                          {new Date(payslip.payPeriod.startDate).toLocaleDateString()} -{" "}
                          {new Date(payslip.payPeriod.endDate).toLocaleDateString()}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(payslip.netPay, payslip.currency)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          payslip.status === "FINALIZED"
                            ? "bg-green-100 text-green-800"
                            : payslip.status === "VOID"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payslip.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(payslip.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
