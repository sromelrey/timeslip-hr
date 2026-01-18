"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateManualEntryDto } from "@/store/core/thunks/timesheet-thunks"

interface ManualEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (dto: CreateManualEntryDto) => Promise<void>
}

export function ManualEntryDialog({
  open,
  onOpenChange,
  onSubmit,
}: ManualEntryDialogProps) {
  const [workDate, setWorkDate] = useState("")
  
  // Regular Session
  const [regStart, setRegStart] = useState("09:00")
  const [regEnd, setRegEnd] = useState("17:00")
  const [regBreakStart, setRegBreakStart] = useState("")
  const [regBreakEnd, setRegBreakEnd] = useState("")
  
  // Overtime Session
  const [otStart, setOtStart] = useState("")
  const [otEnd, setOtEnd] = useState("")
  const [otBreakStart, setOtBreakStart] = useState("")
  const [otBreakEnd, setOtBreakEnd] = useState("")

  const [regularMinutes, setRegularMinutes] = useState(0)
  const [overtimeMinutes, setOvertimeMinutes] = useState(0)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateSessionMinutes = (startStr: string, endStr: string, bStartStr: string, bEndStr: string) => {
    if (!startStr || !endStr) return 0
    
    const start = new Date(`1970-01-01T${startStr}:00`)
    const end = new Date(`1970-01-01T${endStr}:00`)
    
    if (end <= start) return 0

    let duration = (end.getTime() - start.getTime()) / (1000 * 60)
    
    if (bStartStr && bEndStr) {
      const bStart = new Date(`1970-01-01T${bStartStr}:00`)
      const bEnd = new Date(`1970-01-01T${bEndStr}:00`)
      if (bEnd > bStart) {
        const breakDur = (bEnd.getTime() - bStart.getTime()) / (1000 * 60)
        duration = Math.max(0, duration - breakDur)
      }
    }
    return Math.round(duration)
  }

  // Auto-calculate
  React.useEffect(() => {
    setRegularMinutes(calculateSessionMinutes(regStart, regEnd, regBreakStart, regBreakEnd))
    setOvertimeMinutes(calculateSessionMinutes(otStart, otEnd, otBreakStart, otBreakEnd))
  }, [regStart, regEnd, regBreakStart, regBreakEnd, otStart, otEnd, otBreakStart, otBreakEnd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workDate || !reason || reason.length < 10) return
    if (regularMinutes + overtimeMinutes <= 0) return

    setIsSubmitting(true)
    try {
      const dto: CreateManualEntryDto = {
        workDate,
        regularMinutes,
        overtimeMinutes,
        reason,
      }
      await onSubmit(dto)
      // Reset
      setWorkDate("")
      setRegStart("09:00")
      setRegEnd("17:00")
      setRegBreakStart("")
      setRegBreakEnd("")
      setOtStart("")
      setOtEnd("")
      setOtBreakStart("")
      setOtBreakEnd("")
      setReason("")
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Manual Entry</DialogTitle>
          <DialogDescription>
             Define separate sessions for Regular and Overtime work. Both support optional break times.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workDate">Date</Label>
              <Input
                id="workDate"
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                required
              />
            </div>

            {/* Regular Session Section */}
            <div className="space-y-3 p-3 border rounded-md bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                Regular Session
                <span className="text-primary">{(regularMinutes / 60).toFixed(2)}h</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="regStart" className="text-[10px]">Start</Label>
                  <Input id="regStart" type="time" value={regStart} onChange={(e) => setRegStart(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="regEnd" className="text-[10px]">End</Label>
                  <Input id="regEnd" type="time" value={regEnd} onChange={(e) => setRegEnd(e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="regBreakStart" className="text-[10px]">Break Start</Label>
                  <Input id="regBreakStart" type="time" value={regBreakStart} onChange={(e) => setRegBreakStart(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="regBreakEnd" className="text-[10px]">Break End</Label>
                  <Input id="regBreakEnd" type="time" value={regBreakEnd} onChange={(e) => setRegBreakEnd(e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
            </div>

            {/* Overtime Session Section */}
            <div className="space-y-3 p-3 border rounded-md bg-amber-50/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                Overtime Session
                <span className="text-amber-600">{(overtimeMinutes / 60).toFixed(2)}h</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="otStart" className="text-[10px]">Start</Label>
                  <Input id="otStart" type="time" value={otStart} onChange={(e) => setOtStart(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="otEnd" className="text-[10px]">End</Label>
                  <Input id="otEnd" type="time" value={otEnd} onChange={(e) => setOtEnd(e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="otBreakStart" className="text-[10px]">Break Start</Label>
                  <Input id="otBreakStart" type="time" value={otBreakStart} onChange={(e) => setOtBreakStart(e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="otBreakEnd" className="text-[10px]">Break End</Label>
                  <Input id="otBreakEnd" type="time" value={otBreakEnd} onChange={(e) => setOtBreakEnd(e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
                <div className="flex justify-between font-bold">
                    <span>Total Net Work:</span>
                    <span>{((regularMinutes + overtimeMinutes) / 60).toFixed(2)}h</span>
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (min 10 characters)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this entry is being added manually..."
                required
                minLength={10}
              />
              {reason.length > 0 && reason.length < 10 && (
                <p className="text-[10px] text-destructive">Reason must be at least 10 characters ({reason.length}/10)</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={isSubmitting || !workDate || reason.length < 10 || (regularMinutes + overtimeMinutes) <= 0}
            >
              {isSubmitting ? "Adding..." : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
