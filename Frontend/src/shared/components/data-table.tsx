"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
// Tanstack Table
import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

// Shadcn Components
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils/utils";
import DropDownActions from "./lead-drop-down-action";

interface DataTableProps<TData extends { _id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  clickable?: boolean;
  tableHead?: React.ReactNode;
}

export function DataTable<TData extends { _id: string }, TValue>({
  columns,
  data,
  clickable = false,
  tableHead,
}: DataTableProps<TData, TValue>) {
  // Table States
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Router
  const router = useRouter();

  // Table Hook
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const users_ids = table
    .getSelectedRowModel()
    .rows.map((row) => row.original._id);

  function rowClickAction(id: string) {
    if (clickable) {
      router.push(`/dashboard/employees/${id}`);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Table Header */}
      <div className="px-4 py-4">
        {tableHead}
        {table.getFilteredSelectedRowModel().rows.length === 0 && (
          <div className="flex items-center justify-between  max-sm:flex-col max-sm:gap-4">
            <Input
              placeholder="Search any..."
              value={globalFilter ?? ""}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="rounded-md">
                  <Button variant="outline" className="ml-auto">
                    Fields
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
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
      {/* If something selected */}
      <div className="flex-1 text-sm text-muted-foreground px-4 py-4">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-base font-bold">
              {table.getFilteredSelectedRowModel().rows.length} Selected
            </p>
            <DropDownActions ids={users_ids} bulk={true} />
          </div>
        )}
      </div>

      {/* TABLE */}
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
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, i) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "font-bold text-sm",
                    clickable && "cursor-pointer",
                  )}
                  onClick={() => rowClickAction(row.original._id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4 pr-4">
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
  );
}
