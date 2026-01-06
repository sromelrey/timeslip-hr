"use client";

import { useAuth } from "@/hooks/auth";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useDashboardRefresh } from "@/hooks/use-dashboard-refresh";
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  RefreshCw,
  UserCheck,
  Coffee
} from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { RecentActivityFeed } from "@/components/admin/dashboard/recent-activity-feed";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error, refetch } = useDashboardStats();

  // Auto-refresh every 5 minutes
  useDashboardRefresh(refetch);

  if (loading && !stats) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loading...</h1>
          <p className="text-muted-foreground">Fetching dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Error</h1>
          <p className="text-destructive">{error}</p>
          <Button onClick={refetch} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      name: "Total Employees", 
      value: stats?.totalEmployees || 0, 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      name: "Attendance Today", 
      value: `${stats?.attendanceToday.percentage || 0}%`, 
      icon: Clock, 
      color: "text-green-500", 
      bg: "bg-green-50" 
    },
    { 
      name: "Pending Approvals", 
      value: (stats?.pendingApprovals.timesheets || 0) + (stats?.pendingApprovals.payslips || 0), 
      icon: Calendar, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    },
    { 
      name: "Present Today", 
      value: `${stats?.attendanceToday.present || 0}/${stats?.attendanceToday.total || 0}`, 
      icon: TrendingUp, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
    {
      name: "Currently Clocked In",
      value: stats?.currentlyClockedIn || 0,
      icon: UserCheck,
      color: "text-teal-500",
      bg: "bg-teal-50"
    },
    {
      name: "On Break",
      value: stats?.onBreak || 0,
      icon: Coffee,
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.firstName || user?.name || 'Admin'}
          </h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your team today.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refetch}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm h-64">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground italic">Chart visualization coming soon</p>
          </div>
        </div>
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <RecentActivityFeed activities={stats?.recentActivity || []} />
        </div>
      </div>
    </div>
  );
}
