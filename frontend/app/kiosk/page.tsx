"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServerTime, resetState } from "@/store/core/slices/time-event-slice";
import AnalogClock from "@/components/AnalogClock";
import TimeEntryForm from "@/components/TimeEntryForm";
import RecentLogs from "@/components/RecentLogs";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store";

export default function KioskPage() {
  const dispatch = useAppDispatch();
  const { serverTime, currentStatus, recentEvents } = useAppSelector((state: RootState) => state.timeEvent);

  useEffect(() => {
    // Initial fetch of server time
    dispatch(fetchServerTime());
    
    // Cleanup on unmount
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  // Sync server time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(fetchServerTime());
    }, 60000);
    return () => clearInterval(timer);
  }, [dispatch]);

  return (
    <div className="space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Employee Time Kiosk
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter your employee number and PIN to log your time.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col items-center space-y-8">
          <AnalogClock serverTime={serverTime || undefined} />
          
          <Card className="w-full p-6 bg-secondary/30 border-none shadow-none">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Your Current Status
            </h2>
            <div className="text-3xl font-mono font-bold text-primary">
              {currentStatus?.replace("_", " ") || "READY"}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <TimeEntryForm />
          
          <div className="pt-4 border-t border-border">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              Recent Activity
            </h3>
            <RecentLogs events={recentEvents} />
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
        &copy; {new Date().getFullYear()} TimeSlip-HR System. All rights reserved.
      </footer>
    </div>
  );
}
