"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, CheckCircle, Eye, Lock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Timesheet, TimesheetStatus } from "@/store/core/thunks/timesheet-thunks"
import Link from "next/link"

// Helper to determine which status actions are available
const getAvailableActions = (status: TimesheetStatus) => {
  switch (status) {
    case TimesheetStatus.DRAFT:
      return ['REVIEWED']
    case TimesheetStatus.REVIEWED:
      return ['APPROVED', 'DRAFT'] // Can approve or revert to draft
    case TimesheetStatus.APPROVED:
      return ['LOCKED', 'REVIEWED'] // Can lock or revert to reviewed
    case TimesheetStatus.LOCKED:
      return [] // No actions on locked timesheets
    default:
      return []
  }
}

// This will be passed from the parent component
interface ColumnProps {
  onStatusUpdate?: (id: number, status: TimesheetStatus) => void
  onPopulate?: (id: number) => void
}

export const createColumns = (props?: ColumnProps): ColumnDef<Timesheet>[] => [
  {
    header: 'Employee',
    accessorFn: (row) => `${row.employee?.firstName} ${row.employee?.lastName}`,
    cell: ({ row }) => {
      const name = `${row.original.employee?.firstName} ${row.original.employee?.lastName}`
      const empNum = row.original.employee?.employeeNumber
      return (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">#{empNum}</div>
        </div>
      )
    }
  },
  {
    header: 'Pay Period',
    accessorFn: (row) => `${row.payPeriod?.startDate} - ${row.payPeriod?.endDate}`,
    cell: ({ row }) => {
        const start = row.original.payPeriod?.startDate
        const end = row.original.payPeriod?.endDate
        return <span>{start} to {end}</span>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TimesheetStatus
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      
      switch (status) {
        case TimesheetStatus.APPROVED:
          variant = "default"
          break
        case TimesheetStatus.REVIEWED:
          variant = "secondary"
          break
        case TimesheetStatus.LOCKED:
          variant = "destructive"
          break
        case TimesheetStatus.DRAFT:
          variant = "outline"
          break
      }

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const timesheet = row.original
      const availableActions = getAvailableActions(timesheet.status)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(timesheet.id.toString())}
            >
              Copy Timesheet ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/timesheet/${timesheet.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
            </DropdownMenuItem>
            {timesheet.status === TimesheetStatus.DRAFT && props?.onPopulate && (
              <DropdownMenuItem onClick={() => props.onPopulate?.(timesheet.id)}>
                <FileText className="mr-2 h-4 w-4" />
                Populate Days
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {availableActions.includes('REVIEWED') && props?.onStatusUpdate && (
              <DropdownMenuItem onClick={() => props.onStatusUpdate?.(timesheet.id, TimesheetStatus.REVIEWED)}>
                <Eye className="mr-2 h-4 w-4" />
                Mark as Reviewed
              </DropdownMenuItem>
            )}
            {availableActions.includes('APPROVED') && props?.onStatusUpdate && (
              <DropdownMenuItem onClick={() => props.onStatusUpdate?.(timesheet.id, TimesheetStatus.APPROVED)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            )}
            {availableActions.includes('LOCKED') && props?.onStatusUpdate && (
              <DropdownMenuItem onClick={() => props.onStatusUpdate?.(timesheet.id, TimesheetStatus.LOCKED)}>
                <Lock className="mr-2 h-4 w-4" />
                Lock
              </DropdownMenuItem>
            )}
            {availableActions.includes('DRAFT') && props?.onStatusUpdate && (
              <DropdownMenuItem onClick={() => props.onStatusUpdate?.(timesheet.id, TimesheetStatus.DRAFT)}>
                Revert to Draft
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Default export for backward compatibility
export const columns: ColumnDef<Timesheet>[] = createColumns()

