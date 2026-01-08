import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * Base Skeleton component
 */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      style={style}
    />
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * TableSkeleton - Loading skeleton for data tables
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Header row */}
      <div className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={`cell-${rowIdx}-${colIdx}`}
              className="h-4 flex-1"
              style={{ animationDelay: `${rowIdx * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
}

/**
 * CardSkeleton - Loading skeleton for stat cards
 */
export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 space-y-3",
        className
      )}
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

interface StatCardsSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * StatCardsSkeleton - Loading skeleton for dashboard stat cards grid
 */
export function StatCardsSkeleton({
  count = 4,
  className,
}: StatCardsSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={`card-${i}`} />
      ))}
    </div>
  );
}

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

/**
 * FormSkeleton - Loading skeleton for forms
 */
export function FormSkeleton({ fields = 4, className }: FormSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={`field-${i}`} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
}

interface PageSkeletonProps {
  variant?: "table" | "cards" | "form";
  className?: string;
}

/**
 * PageSkeleton - Full page loading skeleton with header
 */
export function PageSkeleton({ variant = "table", className }: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Content based on variant */}
      {variant === "table" && <TableSkeleton />}
      {variant === "cards" && <StatCardsSkeleton />}
      {variant === "form" && <FormSkeleton />}
    </div>
  );
}
