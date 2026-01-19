"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Plus } from "lucide-react"
import { useEffect, useMemo, useCallback } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

import { useTimesheetManagement } from "@/hooks/timesheets"
import { createColumns } from "./column"
import { TimesheetStatus } from "@/store/core/thunks/timesheet-thunks"
import { GenerateTimesheetDialog } from "@/components/admin/generate-timesheet-dialog"

export default function TimesheetPage() {
  const { timesheets, isLoading, actionLoadingIds, loadTimesheets, generateCustomTimesheets, updateStatus, populateDays } = useTimesheetManagement()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Load timesheets on mount
  useEffect(() => {
    loadTimesheets()
  }, [loadTimesheets])

  const handleStatusUpdate = useCallback(async (id: number, status: TimesheetStatus) => {
    try {
      await updateStatus(id, status)
      toast({ title: "Success", description: `Timesheet status updated to ${status}` })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update status"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }, [updateStatus])

  const handlePopulate = useCallback(async (id: number) => {
    try {
      await populateDays(id)
      toast({ title: "Success", description: "Timesheet days populated from time events" })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to populate days"
      toast({ title: "Error", description: message, variant: "destructive" })
    }
  }, [populateDays])

  const columns = useMemo(() => createColumns({
    onStatusUpdate: handleStatusUpdate,
    onPopulate: handlePopulate,
    actionLoadingIds,
  }), [handleStatusUpdate, handlePopulate, actionLoadingIds])

  const table = useReactTable({
    data: timesheets,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Dialog state for Generate Timesheets
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = React.useState(false)

  const handleGenerateCustom = async (dto: { startDate: string; endDate: string }) => {
    try {
      await generateCustomTimesheets(dto)
      toast({ title: "Success", description: "Timesheets generated successfully" })
      loadTimesheets()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to generate timesheets"
      toast({ title: "Error", description: message, variant: "destructive" })
      throw e
    }
  }

  return (
    <div className="w-full">
      <GenerateTimesheetDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
        onGenerateCustom={handleGenerateCustom}
      />
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter by employee..."
            value={(table.getColumn("Employee")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Employee")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsGenerateDialogOpen(true)} variant="default">
                <Plus className="mr-2 h-4 w-4" /> Generate Timesheets
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && timesheets.length === 0 ? (
               <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading timesheets...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No timesheets found. Try generating some.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
