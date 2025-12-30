"use client"

import * as React from "react"
import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { timesheetApi, PayPeriod } from "@/lib/timesheet.api"

interface GenerateTimesheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (payPeriodId: number) => Promise<void>
}

export function GenerateTimesheetDialog({
  open,
  onOpenChange,
  onGenerate,
}: GenerateTimesheetDialogProps) {
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([])
  const [selectedPayPeriodId, setSelectedPayPeriodId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Fetch pay periods when dialog opens
  useEffect(() => {
    if (open) {
      setIsFetching(true)
      timesheetApi
        .getPayPeriods()
        .then((data) => {
          setPayPeriods(data)
          // Auto-select the first one if available
          if (data.length > 0) {
            setSelectedPayPeriodId(data[0].id.toString())
          }
        })
        .catch((err) => {
          console.error("Failed to fetch pay periods:", err)
        })
        .finally(() => {
          setIsFetching(false)
        })
    }
  }, [open])

  const handleGenerate = async () => {
    if (!selectedPayPeriodId) return

    setIsLoading(true)
    try {
      await onGenerate(Number(selectedPayPeriodId))
      onOpenChange(false)
      setSelectedPayPeriodId("")
    } catch (error) {
      console.error("Failed to generate timesheets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString()
    const end = new Date(endDate).toLocaleDateString()
    return `${start} - ${end}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Timesheets</DialogTitle>
          <DialogDescription>
            Select a pay period to generate timesheets for all active employees.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pay-period">Pay Period</Label>
            {isFetching ? (
              <div className="text-muted-foreground text-sm">Loading pay periods...</div>
            ) : payPeriods.length === 0 ? (
              <div className="text-destructive text-sm">
                No pay periods found. Please create pay periods first.
              </div>
            ) : (
              <Select
                value={selectedPayPeriodId}
                onValueChange={setSelectedPayPeriodId}
              >
                <SelectTrigger id="pay-period">
                  <SelectValue placeholder="Select a pay period" />
                </SelectTrigger>
                <SelectContent>
                  {payPeriods.map((period) => (
                    <SelectItem key={period.id} value={period.id.toString()}>
                      {formatDateRange(period.startDate, period.endDate)}
                      {period.status === "CLOSED" && " (Closed)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!selectedPayPeriodId || isLoading || payPeriods.length === 0}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
