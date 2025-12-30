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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AdjustmentField, AdjustmentMode, CreateAdjustmentDto } from "@/lib/timesheet.api"

interface AdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayId: number
  workDate: string
  currentValues: {
    regularMinutes: number
    breakMinutes: number
    overtimeMinutes: number
  }
  onSubmit: (dayId: number, dto: CreateAdjustmentDto) => Promise<void>
}

export function AdjustmentDialog({
  open,
  onOpenChange,
  dayId,
  workDate,
  currentValues,
  onSubmit,
}: AdjustmentDialogProps) {
  const [field, setField] = useState<AdjustmentField>("REGULAR")
  const [mode, setMode] = useState<AdjustmentMode>("DELTA")
  const [minutes, setMinutes] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!minutes || !reason || reason.length < 10) return

    setIsSubmitting(true)
    try {
      const dto: CreateAdjustmentDto = {
        field,
        mode,
        reason,
        ...(mode === "DELTA" ? { deltaMinutes: parseInt(minutes) } : { overrideMinutes: parseInt(minutes) }),
      }
      await onSubmit(dayId, dto)
      // Reset and close
      setField("REGULAR")
      setMode("DELTA")
      setMinutes("")
      setReason("")
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentValue = () => {
    switch (field) {
      case "REGULAR": return currentValues.regularMinutes
      case "BREAK": return currentValues.breakMinutes
      case "OVERTIME": return currentValues.overtimeMinutes
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Time Entry</DialogTitle>
          <DialogDescription>
            Make an adjustment for {workDate}. Current: {(getCurrentValue() / 60).toFixed(1)}h
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="field">Field to Adjust</Label>
              <Select value={field} onValueChange={(v: AdjustmentField) => setField(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular Minutes</SelectItem>
                  <SelectItem value="BREAK">Break Minutes</SelectItem>
                  <SelectItem value="OVERTIME">Overtime Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Adjustment Mode</Label>
              <RadioGroup value={mode} onValueChange={(v: AdjustmentMode) => setMode(v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DELTA" id="delta" />
                  <Label htmlFor="delta" className="font-normal">Add/Subtract</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OVERRIDE" id="override" />
                  <Label htmlFor="override" className="font-normal">Set Value</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minutes">
                {mode === "DELTA" ? "Minutes to Add (use negative to subtract)" : "New Value (minutes)"}
              </Label>
              <Input
                id="minutes"
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder={mode === "DELTA" ? "e.g. 30 or -15" : "e.g. 480"}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (min 10 characters)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this adjustment is needed..."
                required
                minLength={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || reason.length < 10}>
              {isSubmitting ? "Saving..." : "Save Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
