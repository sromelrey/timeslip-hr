"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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

export const columns: ColumnDef<Timesheet>[] = [
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
        // Assume payPeriod object is available and has startDate/endDate
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
          variant = "default" // or success color if available
          break
        case TimesheetStatus.REVIEWED:
          variant = "secondary"
          break
        case TimesheetStatus.LOCKED:
            variant = "secondary"
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
                <Link href={`/timesheet/${timesheet.id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
