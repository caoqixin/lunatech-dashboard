"use client";

import * as React from "react";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "./type";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  /**
   * 表格实例
   */
  table: Table<TData>;

  /**
   * 可搜索列
   */
  searchKey?: DataTableSearchableColumn<TData>[];

  /**
   * 可过滤列
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterableColumns,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const hasSearchKey = searchKey && searchKey.length > 0;
  const hasFilterableColumns =
    filterableColumns && filterableColumns.length > 0;

  // 如果没有搜索和过滤功能，不显示工具栏
  if (!hasSearchKey && !hasFilterableColumns && !isFiltered) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        {/* 搜索框 */}
        {hasSearchKey && (
          <div className="flex flex-1 items-center space-x-2">
            {searchKey.map((column) => (
              <Input
                key={String(column.id)}
                placeholder={column.placeholder || `搜索...`}
                value={
                  (table
                    .getColumn(String(column.id))
                    ?.getFilterValue() as string) || ""
                }
                onChange={(event) =>
                  table
                    .getColumn(String(column.id))
                    ?.setFilterValue(event.target.value)
                }
                className="h-9 w-full max-w-sm"
              />
            ))}
          </div>
        )}

        {/* 过滤器 */}
        {hasFilterableColumns && (
          <div className="hidden sm:flex items-center space-x-2">
            {filterableColumns.map((column) => {
              return (
                column.options && (
                  <DataTableFacetedFilter
                    key={String(column.id)}
                    column={table.getColumn(String(column.id))}
                    title={column.title}
                    options={column.options}
                  />
                )
              );
            })}
          </div>
        )}

        {/* 重置过滤器按钮 */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-3 rounded-md border text-xs text-muted-foreground hover:bg-gray-100"
          >
            <Cross2Icon className="mr-2 h-4 w-4" />
            重置
          </Button>
        )}
      </div>

      {/* 列显示选项 */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
