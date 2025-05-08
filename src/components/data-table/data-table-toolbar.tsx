"use client";

import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "./type";
import { XIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  /**
   * 表格实例
   */
  table: Table<TData>;

  /**
   * 可搜索列
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];

  /**
   * 可过滤列
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  searchableColumns = [],
  filterableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const hasSearchInputs = searchableColumns.length > 0;
  const hasFilters = filterableColumns.length > 0;
  const showToolbar = hasSearchInputs || hasFilters || isFiltered;
  // 如果没有搜索和过滤功能，不显示工具栏
  if (!showToolbar) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-3 py-2">
      {" "}
      {/* flex-wrap and gap */}
      {/* Left side: Search and Filters */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[200px]">
        {" "}
        {/* flex-1 to grow */}
        {/* Search Inputs */}
        {hasSearchInputs &&
          searchableColumns.map((column) => (
            <Input
              key={String(column.id)}
              placeholder={column.placeholder || `搜索 ${String(column.id)}...`} // More specific placeholder
              value={
                (table
                  .getColumn(String(column.id))
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(String(column.id))
                  ?.setFilterValue(event.target.value)
              }
              // Make search inputs slightly smaller on mobile, grow on larger screens
              className="h-9 w-full sm:w-auto sm:max-w-[200px] lg:max-w-[250px] flex-grow sm:flex-grow-0"
            />
          ))}
        {/* Filters */}
        {hasFilters &&
          filterableColumns.map(
            (column) =>
              column.options && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(String(column.id))}
                  title={column.title}
                  options={column.options}
                />
              )
          )}
        {/* Reset Button (only if filters active) */}
        {isFiltered && (
          <Button
            aria-label="重置筛选"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2.5 lg:px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <XIcon className="mr-1.5 h-4 w-4" />
            重置
          </Button>
        )}
      </div>
      {/* Right side: View Options */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
