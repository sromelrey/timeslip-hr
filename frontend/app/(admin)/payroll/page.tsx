"use client";

import { Banknote } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 bg-primary/10 rounded-full">
        <Banknote className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">Payroll Management</h1>
      <p className="text-muted-foreground max-w-md">
        This feature is currently under development. Here you will be able to manage employee salaries, bonuses, and tax deductions.
      </p>
    </div>
  );
}
