"use client";

import { Clock, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityItem {
  id: number;
  employeeName: string;
  eventType: string;
  timestamp: Date;
}

interface RecentActivityFeedProps {
  activities: RecentActivityItem[];
}

// Helper function for relative time
function getRelativeTime(timestamp: Date): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Get icon and color based on event type
function getEventStyle(eventType: string) {
  switch (eventType) {
    case 'CLOCK_IN':
      return { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'CLOCK_OUT':
      return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' };
    case 'BREAK_IN':
      return { icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' };
    case 'BREAK_OUT':
      return { icon: Coffee, color: 'text-gray-500', bg: 'bg-gray-50' };
    default:
      return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' };
  }
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {activities.map((activity) => {
        const style = getEventStyle(activity.eventType);
        const Icon = style.icon;
        
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", style.bg)}>
              <Icon className={cn("w-4 h-4", style.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {activity.employeeName}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.eventType.replace('_', ' ')} • {getRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
