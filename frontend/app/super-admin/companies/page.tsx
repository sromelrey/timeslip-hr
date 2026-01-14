"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Plus, Loader2 } from "lucide-react";
import { useCompanyManagement } from "@/hooks/super-admin/use-company-management";
import { columns } from "./column";
import { CompanyDialog } from "@/components/super-admin/CompanyDialog";
import { AdminCreationDialog } from "@/components/super-admin/AdminCreationDialog";
import { Company, CreateCompanyDto } from "@/lib/super-admin.api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function CompaniesPage() {
  const { 
    companies, 
    loading, 
    loadCompanies, 
    createCompany, 
    updateCompany, 
    deleteCompany 
  } = useCompanyManagement();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [provisioningCompany, setProvisioningCompany] = useState<Company | null>(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const filteredData = React.useMemo(() => {
    return companies.filter((c) =>
      c.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [companies, filterText]);

  const handleCreateNew = () => {
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setDialogOpen(true);
  };

  const handleProvisionAdmin = (company: Company) => {
    setProvisioningCompany(company);
    setAdminDialogOpen(true);
  };

  const handleFormSubmit = async (dto: CreateCompanyDto) => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, dto);
    } else {
      await createCompany(dto);
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      onEdit: handleEdit,
      onDelete: deleteCompany,
      onProvisionAdmin: handleProvisionAdmin,
    },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage all registered companies in the system.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
            <Input
                placeholder="Filter companies..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="max-w-sm"
            />
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading && companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading companies...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2">
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

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        companyToEdit={editingCompany}
        onSubmit={handleFormSubmit}
      />

      <AdminCreationDialog
        open={adminDialogOpen}
        onOpenChange={setAdminDialogOpen}
        companyId={provisioningCompany?.id || null}
        companyName={provisioningCompany?.name || null}
      />
    </div>
  );
}
