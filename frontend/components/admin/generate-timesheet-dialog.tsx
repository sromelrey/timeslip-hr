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
import { GenerateCustomTimesheetDto } from "@/store/core/thunks/timesheet-thunks"

interface GenerateTimesheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerateCustom: (dto: GenerateCustomTimesheetDto) => Promise<void>
}

export function GenerateTimesheetDialog({
  open,
  onOpenChange,
  onGenerateCustom,
}: GenerateTimesheetDialogProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) return
    if (endDate < startDate) return // Basic validation

    setIsSubmitting(true)
    try {
      await onGenerateCustom({ startDate, endDate })
      onOpenChange(false)
      setStartDate("")
      setEndDate("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Timesheets</DialogTitle>
          <DialogDescription>
             Define a custom date range. A Pay Period will be created automatically if needed, and empty timesheets will be generated for all active employees.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            {startDate && endDate && endDate < startDate && (
                 <p className="text-sm text-destructive">End date cannot be before start date.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !startDate || !endDate || endDate < startDate}>
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
