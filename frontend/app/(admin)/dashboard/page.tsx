"use client";

import { useAuth } from "@/hooks/auth";
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp 
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: "Total Employees", value: "124", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Attendance Today", value: "92%", icon: Clock, color: "text-green-500", bg: "bg-green-50" },
    { name: "Pending Approvals", value: "8", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Monthly Growth", value: "+12.5%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName || user?.name || 'Admin'}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your team today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm h-64 flex items-center justify-center">
            <p className="text-muted-foreground italic">Activity Chart Placeholder</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm h-64 flex items-center justify-center">
            <p className="text-muted-foreground italic">Recent Notifications Placeholder</p>
        </div>
      </div>
    </div>
  );
}
