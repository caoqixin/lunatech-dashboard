"use client";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  /**
   * 表格实例
   */
  table: Table<TData>;
  pageSizeOptions?: number[]; // Allow customizing page size options
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const { pageSize, pageIndex } = table.getState().pagination;
  // Use getRowCount for potentially non-materialized rows if needed, else getFilteredRowModel
  const totalRows = table.getRowCount(); // Or table.getFilteredRowCount() if filters apply
  const pageCount = table.getPageCount();
  const isSelectionEnabled = table.options.enableRowSelection;
  const selectedRowCount = isSelectionEnabled
    ? table.getFilteredSelectedRowModel().rows.length // Only access if enabled
    : 0; // Default to 0 if selection is disabled

  // Calculate row range robustly
  const firstRow = pageIndex * pageSize + 1;
  // Ensure lastRow doesn't exceed totalRows, especially if totalRows is 0
  const lastRow =
    totalRows === 0 ? 0 : Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-2 py-1 text-sm">
      {/* Left: Row Info */}
      <div className="text-muted-foreground">
        {/* Display selected count only if selection is enabled and count > 0 */}
        {isSelectionEnabled && selectedRowCount > 0
          ? `${selectedRowCount} / ${totalRows} 行已选`
          : `共 ${totalRows} 行`}
      </div>

      {/* Right: Controls (wrapping enabled) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:gap-x-8">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-muted-foreground">每页行数</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            // Disable if pageCount is 0 or 1? Optional.
            // disabled={pageCount <= 1}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Info */}
        <div className="flex w-[110px] items-center justify-center whitespace-nowrap text-muted-foreground">
          {/* Correct display when pageCount is 0 */}第{" "}
          {pageCount > 0 ? pageIndex + 1 : 0} 页 / {pageCount} 页
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            aria-label="跳转首页"
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {" "}
            <ChevronsLeft className="h-4 w-4" />{" "}
          </Button>
          <Button
            aria-label="上一页"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {" "}
            <ChevronLeft className="h-4 w-4" />{" "}
          </Button>
          <Button
            aria-label="下一页"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {" "}
            <ChevronRight className="h-4 w-4" />{" "}
          </Button>
          <Button
            aria-label="跳转末页"
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            {" "}
            <ChevronsRight className="h-4 w-4" />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
