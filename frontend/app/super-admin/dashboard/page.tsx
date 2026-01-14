"use client";

import React, { useEffect } from "react";
import { useSuperAdminStats } from "@/hooks/super-admin/use-super-admin-stats";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { Building2, Users, UserCheck, Loader2 } from "lucide-react";

export default function SuperAdminDashboard() {
  const { stats, loading, error, loadStats } = useSuperAdminStats();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground">Global statistics across all companies.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          name="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={Building2}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          name="Total Users"
          value={stats?.totalUsers || 0}
          icon={UserCheck}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          name="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={Users}
          color="text-purple-600"
          bg="bg-purple-100"
        />
      </div>
    </div>
  );
}
