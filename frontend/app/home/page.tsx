
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import AnalogClock from "@/components/AnalogClock";
import TimeEntryForm from "@/components/TimeEntryForm";
import RecentLogs from "@/components/RecentLogs";
import { Separator } from "@/components/ui/separator";
import { Clock, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServerTime, fetchRecentEvents, fetchEmployeeStatus } from "@/store/core/slices/time-event-slice";
import { RootState } from "@/store";

// Initial dummy data (No longer used, using Redux)

const Index = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout, user } = useAuth();
  const { serverTime, recentEvents } = useAppSelector((state: RootState) => state.timeEvent);

  useEffect(() => {
    dispatch(fetchServerTime());
    if (user?.employeeNumber) {
      dispatch(fetchEmployeeStatus(user.employeeNumber.toString()));
      dispatch(fetchRecentEvents(user.employeeNumber.toString()));
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    await logout();
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TimeKeeper</h1>
                <p className="text-sm text-muted-foreground">HRIS Time Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">{user.firstName || user.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Clock Section */}
          <section className="flex justify-center animate-fade-in">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
              <AnalogClock serverTime={serverTime || undefined} />
            </div>
          </section>

          {/* Time Entry Form */}
          <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card">
              <h2 className="text-lg font-semibold text-center text-foreground mb-6">
                Record Your Time
              </h2>
              <TimeEntryForm />
            </div>
          </section>

          <Separator className="my-8" />

          {/* Recent Logs */}
          <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <RecentLogs events={recentEvents} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TimeKeeper HRIS • Secure Time Management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
