import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Setting } from "@/lib/settings.api";
import { Textarea } from "@/components/ui/textarea";

interface SecuritySettingsFormProps {
  settings: Setting | null;
  onSave: (data: Partial<Setting>) => void;
  isLoading: boolean;
}

export const SecuritySettingsForm = ({ settings, onSave, isLoading }: SecuritySettingsFormProps) => {
  const { register, handleSubmit, reset } = useForm<Partial<Setting>>();

  useEffect(() => {
    if (settings) {
      reset({
        sessionDurationMinutes: settings.sessionDurationMinutes,
        passwordPolicy: settings.passwordPolicy,
        pinPolicy: settings.pinPolicy,
        dataRetentionMonths: settings.dataRetentionMonths,
      });
    }
  }, [settings, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Compliance</CardTitle>
        <CardDescription>
          Manage security policies and data retention settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionDurationMinutes">Session Duration (Minutes)</Label>
              <Input 
                id="sessionDurationMinutes" 
                type="number" 
                {...register("sessionDurationMinutes", { valueAsNumber: true })} 
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="dataRetentionMonths">Data Retention (Months)</Label>
              <Input 
                id="dataRetentionMonths" 
                type="number" 
                {...register("dataRetentionMonths", { valueAsNumber: true })} 
              />
            </div>
             <div className="space-y-2 col-span-2">
              <Label htmlFor="passwordPolicy">Password Policy Description</Label>
              <Textarea 
                id="passwordPolicy" 
                {...register("passwordPolicy")} 
                placeholder="Describe complexity requirements..."
              />
            </div>
             <div className="space-y-2 col-span-2">
              <Label htmlFor="pinPolicy">PIN Policy Description</Label>
              <Textarea 
                id="pinPolicy" 
                {...register("pinPolicy")} 
                placeholder="Describe PIN requirements for Kiosk..."
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
