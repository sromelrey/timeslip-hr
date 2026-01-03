"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDeductionActions } from "@/hooks/use-deduction-actions";
import { useAppSelector } from "@/store/hooks";
import type { Deduction, CreateDeductionDto, UpdateDeductionDto } from "@/lib/deduction.api";

interface DeductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deduction?: Deduction | null;
  onSuccess: () => void;
}

const DEDUCTION_TYPES = [
  { value: "TAX", label: "Tax" },
  { value: "SSS", label: "SSS" },
  { value: "PHILHEALTH", label: "PhilHealth" },
  { value: "PAGIBIG", label: "Pag-IBIG" },
  { value: "LOAN", label: "Loan" },
  { value: "OTHER", label: "Other" },
];

export function DeductionDialog({
  open,
  onOpenChange,
  deduction,
  onSuccess,
}: DeductionDialogProps) {
  const { handleCreate, handleUpdate, actionLoading } = useDeductionActions();
  const employees = useAppSelector((state) => state.employee.employees);

  // Form state
  const [employeeId, setEmployeeId] = useState<string>("");
  const [type, setType] = useState<string>("TAX");
  const [label, setLabel] = useState("");
  const [calculationType, setCalculationType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [amount, setAmount] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveUntil, setEffectiveUntil] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Load deduction data into form when editing
  useEffect(() => {
    if (deduction) {
      setEmployeeId(deduction.employeeId.toString());
      setType(deduction.type);
      setLabel(deduction.label);
      setCalculationType(deduction.calculationType);
      setAmount(deduction.amount.toString());
      setEffectiveFrom(deduction.effectiveFrom || "");
      setEffectiveUntil(deduction.effectiveUntil || "");
      setIsActive(deduction.isActive);
    } else {
      // Reset form for create
      setEmployeeId("");
      setType("TAX");
      setLabel("");
      setCalculationType("FIXED");
      setAmount("");
      setEffectiveFrom("");
      setEffectiveUntil("");
      setIsActive(true);
    }
  }, [deduction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (!employeeId) {
      alert("Please select an employee");
      return;
    }

    try {
      if (deduction) {
        // Update
        const dto: UpdateDeductionDto = {
          type: type as UpdateDeductionDto["type"],
          label,
          calculationType,
          amount: amountValue,
          effectiveFrom: effectiveFrom || undefined,
          effectiveUntil: effectiveUntil || undefined,
          isActive,
        };
        await handleUpdate(deduction.id, dto);
      } else {
        // Create
        const dto: CreateDeductionDto = {
          employeeId: parseInt(employeeId, 10),
          type: type as CreateDeductionDto["type"],
          label,
          calculationType,
          amount: amountValue,
          effectiveFrom: effectiveFrom || undefined,
          effectiveUntil: effectiveUntil || undefined,
          isActive,
        };
        await handleCreate(dto);
      }
      onSuccess();
    } catch {
      // Error already logged in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {deduction ? "Edit Deduction" : "Create Deduction"}
          </DialogTitle>
          <DialogDescription>
            {deduction
              ? "Update deduction details below"
              : "Add a new deduction for an employee"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Select */}
          <div className="space-y-2">
            <Label htmlFor="employee">Employee *</Label>
            <Select
              value={employeeId}
              onValueChange={setEmployeeId}
              disabled={!!deduction} // Can't change employee when editing
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.firstName} {emp.lastName} (#{emp.employeeNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Select */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEDUCTION_TYPES.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., SSS Contribution, Withholding Tax"
              required
            />
          </div>

          {/* Calculation Type Radio */}
          <div className="space-y-2">
            <Label>Calculation Type *</Label>
            <RadioGroup
              value={calculationType}
              onValueChange={(val) => setCalculationType(val as "FIXED" | "PERCENTAGE")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIXED" id="fixed" />
                <Label htmlFor="fixed">Fixed Amount (₱)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
                <Label htmlFor="percentage">Percentage (%)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {calculationType === "FIXED" ? "Amount (₱) *" : "Percentage (%) *"}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={calculationType === "FIXED" ? "500.00" : "5.0"}
              required
            />
          </div>

          {/* Effective From */}
          <div className="space-y-2">
            <Label htmlFor="effectiveFrom">Effective From</Label>
            <Input
              id="effectiveFrom"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
            />
          </div>

          {/* Effective Until */}
          <div className="space-y-2">
            <Label htmlFor="effectiveUntil">Effective Until</Label>
            <Input
              id="effectiveUntil"
              type="date"
              value={effectiveUntil}
              onChange={(e) => setEffectiveUntil(e.target.value)}
            />
          </div>

          {/* Is Active Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading !== null}>
              {deduction ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
