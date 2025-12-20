"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTimesheetManagement } from "@/hooks/timesheets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { TimesheetStatus } from "@/store/core/thunks/timesheet-thunks"

export default function TimesheetDetailPage() {
  const { id } = useParams()
  const tsId = parseInt(id as string)
  const { selectedTimesheet, isLoading, loadTimesheetById, clearSelectedTimesheet, TimesheetStatus } = useTimesheetManagement()

  useEffect(() => {
    if (tsId) {
      loadTimesheetById(tsId)
    }
    return () => {
      clearSelectedTimesheet()
    }
  }, [tsId, loadTimesheetById, clearSelectedTimesheet])

  if (isLoading) {
    return <div className="p-8 text-center">Loading timesheet details...</div>
  }

  if (!selectedTimesheet) {
    return <div className="p-8 text-center">Timesheet not found</div>
  }

  const { employee, payPeriod, status, days } = selectedTimesheet
  
  // Helper for status badge variant
  const getStatusVariant = (s: TimesheetStatus) => {
      switch (s) {
        case TimesheetStatus.APPROVED: return "default"
        case TimesheetStatus.REVIEWED: return "secondary"
        case TimesheetStatus.LOCKED: return "secondary"
        default: return "outline"
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/timesheet">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Timesheet Details</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Employee</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{employee?.firstName} {employee?.lastName}</div>
             <div className="text-muted-foreground">#{employee?.employeeNumber}</div>
             <div className="text-sm text-muted-foreground mt-1">{employee?.position} • {employee?.department}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pay Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{payPeriod?.startDate} to {payPeriod?.endDate}</div>
            <div className="mt-2 text-sm text-muted-foreground">Status: {payPeriod?.status}</div>
             {/* Total hours could be calculated here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getStatusVariant(status)} className="text-md px-3 py-1">
                {status}
            </Badge>
            <div className="mt-4 flex gap-2">
                {/* Actions based on status could go here, e.g. Approve button */}
                <Button variant="secondary" size="sm" disabled>Submit</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Daily Entries</CardTitle>
              <CardDescription>Records of hours worked for each day in the period.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Regular (m)</TableHead>
                        <TableHead>Overtime (m)</TableHead>
                        <TableHead>Break (m)</TableHead>
                        <TableHead className="text-right">Total (h)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {days && days.length > 0 ? (
                        days.map((day) => {
                            const totalMinutes = (day.regularMinutes || 0) + (day.overtimeMinutes || 0);
                            const totalHours = (totalMinutes / 60).toFixed(2);
                            return (
                                <TableRow key={day.id}>
                                    <TableCell className="font-medium">{day.workDate}</TableCell>
                                    <TableCell>{day.regularMinutes}</TableCell>
                                    <TableCell>{day.overtimeMinutes}</TableCell>
                                    <TableCell>{day.breakMinutes}</TableCell>
                                    <TableCell className="text-right">{totalHours}</TableCell>
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">No entries found for this timesheet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  )
}
