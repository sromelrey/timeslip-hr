import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitTimeEvent, fetchEmployeeStatus, fetchRecentEvents, clearError } from "@/store/core/slices/time-event-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, LogOut, Coffee, CoffeeIcon, AlertCircle } from "lucide-react";
import { TimeEventType, TimeEventSource } from "@/lib/enums";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RootState } from "@/store";

const TimeEntryForm = () => {
  const [employeeNo, setEmployeeNo] = useState("");
  const [pin, setPin] = useState("");
  const dispatch = useAppDispatch();
  const { currentStatus, loading, error } = useAppSelector((state: RootState) => state.timeEvent);

  useEffect(() => {
    if (employeeNo.length >= 7) {
      dispatch(fetchEmployeeStatus(employeeNo));
      dispatch(fetchRecentEvents(employeeNo));
    }
  }, [employeeNo, dispatch]);

  const handleAction = async (type: TimeEventType) => {
    if (!employeeNo.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Employee Number",
        variant: "destructive",
      });
      return;
    }

    if (pin && pin.length < 4) {
      toast({
        title: "Error",
        description: "PIN must be at least 4 characters",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      employeeNumber: employeeNo,
      pin: pin || undefined,
      type,
      requestId: crypto.randomUUID(),
      source: TimeEventSource.KIOSK,
    };

    const resultAction = await dispatch(submitTimeEvent(payload));
    
    if (submitTimeEvent.fulfilled.match(resultAction)) {
      setPin(""); // Clear PIN on success
      toast({
        title: "Success",
        description: `${type.replace("_", " ")} recorded successfully.`,
      });
      // Refresh status and history
      dispatch(fetchEmployeeStatus(employeeNo));
      dispatch(fetchRecentEvents(employeeNo));
    }
  };

  const isButtonEnabled = (type: TimeEventType) => {
    if (!currentStatus) return type === TimeEventType.CLOCK_IN;
    
    switch (currentStatus) {
      case 'CLOCKED_OUT':
        return type === TimeEventType.CLOCK_IN;
      case TimeEventType.CLOCK_IN:
      case TimeEventType.BREAK_OUT:
        return type === TimeEventType.CLOCK_OUT || type === TimeEventType.BREAK_IN;
      case TimeEventType.BREAK_IN:
        return type === TimeEventType.BREAK_OUT;
      default:
        return false;
    }
  };

  const actionButtons = [
    { type: TimeEventType.CLOCK_IN, label: "Clock In", icon: LogIn, colorClass: "bg-time-in hover:bg-time-in/90" },
    { type: TimeEventType.CLOCK_OUT, label: "Clock Out", icon: LogOut, colorClass: "bg-time-out hover:bg-time-out/90" },
    { type: TimeEventType.BREAK_IN, label: "Break In", icon: Coffee, colorClass: "bg-break-in hover:bg-break-in/90" },
    { type: TimeEventType.BREAK_OUT, label: "Break Out", icon: CoffeeIcon, colorClass: "bg-break-out hover:bg-break-out/90" },
  ];

  return (
    <div className="w-full space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-auto p-0 underline"
            onClick={() => {
              dispatch(clearError());
              setEmployeeNo("");
            }}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employeeNo">Employee Number</Label>
          <Input
            id="employeeNo"
            type="text"
            placeholder="Enter employee number"
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value.replace(/\D/g, ""))}
            className="h-14 text-xl font-mono text-center tracking-widest"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pin">Security PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="****"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            className="h-14 text-xl text-center tracking-widest"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actionButtons.map(({ type, label, icon: Icon, colorClass }) => (
          <Button
            key={type}
            onClick={() => handleAction(type)}
            disabled={loading || !isButtonEnabled(type)}
            className={`h-20 text-lg font-bold flex flex-col gap-1 ${colorClass} text-white transition-all transform active:scale-95 disabled:opacity-30`}
          >
            <Icon className="w-6 h-6" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeEntryForm;
