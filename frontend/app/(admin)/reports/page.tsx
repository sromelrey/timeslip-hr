"use client";

import { useState } from "react";
import { FileText, Calendar, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimesheetExportDialog } from "@/components/admin/reports/timesheet-export-dialog";
import { AttendanceSummaryDialog } from "@/components/admin/reports/attendance-summary-dialog";
import { useReportActions } from "@/hooks/use-report-actions";

export default function ReportsPage() {
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const { lastExportDate } = useReportActions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Exports</h1>
        <p className="text-muted-foreground">
          Generate and download CSV reports for timesheets and attendance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Timesheet Export Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <CardTitle>Timesheet Export</CardTitle>
            </div>
            <CardDescription>
              Export timesheet data with customizable filters and date ranges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setTimesheetDialogOpen(true)} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Export
            </Button>
            {lastExportDate && (
              <p className="text-xs text-muted-foreground text-center">
                Last export: {new Date(lastExportDate).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Attendance Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <CardTitle>Attendance Summary</CardTitle>
            </div>
            <CardDescription>
              Generate attendance reports with anomaly detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setAttendanceDialogOpen(true)} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            {lastExportDate && (
              <p className="text-xs text-muted-foreground text-center">
                Last export: {new Date(lastExportDate).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <TimesheetExportDialog 
        open={timesheetDialogOpen} 
        onOpenChange={setTimesheetDialogOpen} 
      />
      <AttendanceSummaryDialog 
        open={attendanceDialogOpen} 
        onOpenChange={setAttendanceDialogOpen} 
      />
    </div>
  );
}
