import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Setting } from "@/lib/settings.api";

interface GeneralSettingsFormProps {
  settings: Setting | null;
  onSave: (data: Partial<Setting>) => void;
  isLoading: boolean;
}

export const GeneralSettingsForm = ({ settings, onSave, isLoading }: GeneralSettingsFormProps) => {
  const { register, handleSubmit, reset } = useForm<Partial<Setting>>();

  useEffect(() => {
    if (settings) {
      reset({
        timezone: settings.timezone,
        currency: settings.currency,
      });
    }
  }, [settings, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Basic information about your organization and regional preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" {...register("timezone")} placeholder="e.g. Asia/Manila" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" {...register("currency")} placeholder="e.g. PHP" />
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
