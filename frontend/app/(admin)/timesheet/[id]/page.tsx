"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useTimesheetManagement } from "@/hooks/timesheets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, Edit, AlertTriangle, Clock, Coffee } from "lucide-react"
import Link from "next/link"
import { TimesheetStatus, CreateAdjustmentDto } from "@/store/core/thunks/timesheet-thunks"
import { AdjustmentDialog } from "@/components/admin/adjustment-dialog"
import { toast } from "@/hooks/use-toast"

export default function TimesheetDetailPage() {
  const { id } = useParams()
  const tsId = parseInt(id as string)
  const { 
    selectedTimesheet, 
    rawEvents, 
    isLoading, 
    loadTimesheetById, 
    loadRawEvents, 
    createAdjustment,
    clearSelectedTimesheet, 
    TimesheetStatus 
  } = useTimesheetManagement()

  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<{
    id: number
    workDate: string
    regularMinutes: number
    breakMinutes: number
    overtimeMinutes: number
  } | null>(null)

  useEffect(() => {
    if (tsId) {
      loadTimesheetById(tsId)
      loadRawEvents(tsId)
    }
    return () => {
      clearSelectedTimesheet()
    }
  }, [tsId, loadTimesheetById, loadRawEvents, clearSelectedTimesheet])

  const handleOpenAdjustment = (day: typeof selectedDay) => {
    setSelectedDay(day)
    setAdjustDialogOpen(true)
  }

  const handleSubmitAdjustment = async (dayId: number, dto: CreateAdjustmentDto) => {
    try {
      await createAdjustment(dayId, dto)
      toast({ title: "Adjustment saved", description: "The time entry has been updated." })
      // Refresh the data
      loadTimesheetById(tsId)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save adjustment"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading timesheet details...</div>
  }

  if (!selectedTimesheet) {
    return <div className="p-8 text-center">Timesheet not found</div>
  }

  const { employee, payPeriod, status, days } = selectedTimesheet
  
  const getStatusVariant = (s: TimesheetStatus) => {
      switch (s) {
        case TimesheetStatus.APPROVED: return "default"
        case TimesheetStatus.REVIEWED: return "secondary"
        case TimesheetStatus.LOCKED: return "destructive"
        default: return "outline"
      }
  }

  const parseAnomalies = (json: string | null | undefined): string[] => {
    if (!json) return []
    try {
      return JSON.parse(json)
    } catch {
      return []
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'CLOCK_IN':
      case 'CLOCK_OUT':
        return <Clock className="h-4 w-4" />
      case 'BREAK_IN':
      case 'BREAK_OUT':
        return <Coffee className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString()
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pay Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-medium">{payPeriod?.startDate} to {payPeriod?.endDate}</div>
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
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entries" className="w-full">
        <TabsList>
          <TabsTrigger value="entries">Daily Entries</TabsTrigger>
          <TabsTrigger value="events">Raw Events ({rawEvents.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries">
          <Card>
            <CardHeader>
              <CardTitle>Daily Entries</CardTitle>
              <CardDescription>Records of hours worked for each day. Click Adjust to make corrections.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Regular</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Anomalies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {days && days.length > 0 ? (
                    days.map((day) => {
                      const anomalies = parseAnomalies(day.anomaliesJson)
                      const totalMinutes = (day.regularMinutes || 0) + (day.overtimeMinutes || 0)
                      const totalHours = (totalMinutes / 60).toFixed(2)
                      return (
                        <TableRow key={day.id}>
                          <TableCell className="font-medium">{day.workDate}</TableCell>
                          <TableCell>{(day.regularMinutes / 60).toFixed(1)}h</TableCell>
                          <TableCell>{(day.breakMinutes / 60).toFixed(1)}h</TableCell>
                          <TableCell>{(day.overtimeMinutes / 60).toFixed(1)}h</TableCell>
                          <TableCell className="font-semibold">{totalHours}h</TableCell>
                          <TableCell>
                            {anomalies.length > 0 && (
                              <div className="flex items-center gap-1 text-amber-600" title={anomalies.join('\n')}>
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-sm">{anomalies.length}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenAdjustment({
                                id: day.id,
                                workDate: day.workDate,
                                regularMinutes: day.regularMinutes,
                                breakMinutes: day.breakMinutes,
                                overtimeMinutes: day.overtimeMinutes,
                              })}
                              disabled={status === TimesheetStatus.LOCKED}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        No entries found. Run &quot;Populate Days&quot; first.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Raw Time Events</CardTitle>
              <CardDescription>All clock in/out and break events for this pay period.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawEvents.length > 0 ? (
                    rawEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{formatDate(event.happenedAt)}</TableCell>
                        <TableCell className="font-medium">{formatTime(event.happenedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <span>{event.type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.source}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No events found for this timesheet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedDay && (
        <AdjustmentDialog
          open={adjustDialogOpen}
          onOpenChange={setAdjustDialogOpen}
          dayId={selectedDay.id}
          workDate={selectedDay.workDate}
          currentValues={{
            regularMinutes: selectedDay.regularMinutes,
            breakMinutes: selectedDay.breakMinutes,
            overtimeMinutes: selectedDay.overtimeMinutes,
          }}
          onSubmit={handleSubmitAdjustment}
        />
      )}
    </div>
  )
}
