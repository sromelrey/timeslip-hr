import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Setting } from "@/lib/settings.api";

interface PayrollPoliciesFormProps {
  settings: Setting | null;
  onSave: (data: Partial<Setting>) => void;
  isLoading: boolean;
}

export const PayrollPoliciesForm = ({ settings, onSave, isLoading }: PayrollPoliciesFormProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Partial<Setting>>({
    defaultValues: {
     roundingRule: "NONE",
     breakPolicy: "UNPAID",
     overtimeRule: "NONE",
     payPeriodType: "WEEKLY"
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        roundingRule: settings.roundingRule,
        breakPolicy: settings.breakPolicy,
        overtimeRule: settings.overtimeRule,
        gracePeriodMinutes: settings.gracePeriodMinutes,
        payPeriodType: settings.payPeriodType,
        defaultHourlyRate: settings.defaultHourlyRate,
      });
    }
  }, [settings, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Policies</CardTitle>
        <CardDescription>
          Configure how time and pay are calculated for your employees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="payPeriodType">Pay Period Cycle</Label>
               <Select 
                onValueChange={(val) => setValue("payPeriodType", val)} 
                value={watch("payPeriodType")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                  <SelectItem value="SEMI_MONTHLY">Semi-Monthly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="defaultHourlyRate">Default Hourly Rate</Label>
              <Input 
                id="defaultHourlyRate" 
                type="number" 
                step="0.01" 
                {...register("defaultHourlyRate", { valueAsNumber: true })} 
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="breakPolicy">Break Policy</Label>
               <Select 
                onValueChange={(val) => setValue("breakPolicy", val)} 
                value={watch("breakPolicy")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="gracePeriodMinutes">Grace Period (Minutes)</Label>
              <Input 
                id="gracePeriodMinutes" 
                type="number" 
                {...register("gracePeriodMinutes", { valueAsNumber: true })} 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
