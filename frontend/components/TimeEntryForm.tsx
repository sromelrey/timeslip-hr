import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, LogOut, Coffee, CoffeeIcon } from "lucide-react";

export type TimeAction = "Time In" | "Time Out" | "Break In" | "Break Out";

export interface TimeLog {
  id: string;
  employeeNo: string;
  action: TimeAction;
  timestamp: Date;
}

interface TimeEntryFormProps {
  onLogEntry: (log: TimeLog) => void;
}

const TimeEntryForm = ({ onLogEntry }: TimeEntryFormProps) => {
  const [employeeNo, setEmployeeNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmployeeNo = (): boolean => {
    if (!employeeNo.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your Employee Number",
        variant: "destructive",
      });
      return false;
    }
    
    if (!/^\d+$/.test(employeeNo.trim())) {
      toast({
        title: "Validation Error",
        description: "Employee Number must contain only numbers",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleAction = async (action: TimeAction) => {
    if (!validateEmployeeNo()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const timestamp = new Date();
    const log: TimeLog = {
      id: crypto.randomUUID(),
      employeeNo: employeeNo.trim(),
      action,
      timestamp,
    };

    onLogEntry(log);

    const timeString = timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    toast({
      title: `${action} Recorded`,
      description: `Employee #${employeeNo} - ${action} at ${timeString}`,
    });

    setIsSubmitting(false);
  };

  const actionButtons: { action: TimeAction; icon: typeof LogIn; colorClass: string }[] = [
    { action: "Time In", icon: LogIn, colorClass: "bg-time-in hover:bg-time-in/90 text-time-in-foreground" },
    { action: "Time Out", icon: LogOut, colorClass: "bg-time-out hover:bg-time-out/90 text-time-out-foreground" },
    { action: "Break In", icon: Coffee, colorClass: "bg-break-in hover:bg-break-in/90 text-break-in-foreground" },
    { action: "Break Out", icon: CoffeeIcon, colorClass: "bg-break-out hover:bg-break-out/90 text-break-out-foreground" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <Label htmlFor="employeeNo" className="text-sm font-medium text-foreground">
          Employee Number
        </Label>
        <Input
          id="employeeNo"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter your employee number"
          value={employeeNo}
          onChange={(e) => setEmployeeNo(e.target.value.replace(/\D/g, ""))}
          className="h-12 text-lg font-mono text-center tracking-wider bg-card border-2 focus:border-primary transition-colors"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {actionButtons.map(({ action, icon: Icon, colorClass }) => (
          <Button
            key={action}
            onClick={() => handleAction(action)}
            disabled={isSubmitting}
            className={`h-16 text-base font-semibold action-button shadow-soft ${colorClass}`}
          >
            <Icon className="w-5 h-5 mr-2" />
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeEntryForm;
