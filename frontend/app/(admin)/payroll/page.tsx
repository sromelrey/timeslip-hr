"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Calendar, Receipt } from "lucide-react";
import { PayPeriodTab } from "@/components/payroll/pay-period-tab";
import { PayslipTab } from "@/components/payroll/payslip-tab";

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("pay-periods");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Banknote className="w-8 h-8 text-primary" />
            Payroll Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage pay periods, generate payslips, and process payroll
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="pay-periods" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Pay Periods
          </TabsTrigger>
          <TabsTrigger value="payslips" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Payslips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pay-periods" className="mt-6">
          <PayPeriodTab />
        </TabsContent>

        <TabsContent value="payslips" className="mt-6">
          <PayslipTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
