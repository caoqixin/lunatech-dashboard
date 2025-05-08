"use client";

import * as React from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Settings2, Eye, EyeOff } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DataTableViewOptionsProps<TData> {
  /**
   * 表格实例
   */
  table: Table<TData>;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 数据表格视图选项组件
 * 用于控制列的显示和隐藏
 */
export function DataTableViewOptions<TData>({
  table,
  className,
}: DataTableViewOptionsProps<TData>) {
  // Get only columns that are explicitly enabled for hiding
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide()); // Filter based on getCanHide

  const visibleColumnCount = hideableColumns.filter((col) =>
    col.getIsVisible()
  ).length;
  const hiddenColumnCount = hideableColumns.length - visibleColumnCount;

  if (hideableColumns.length === 0) {
    return null; // Don't render if no columns can be hidden
  }

  const toggleAllColumns = (isVisible: boolean) => {
    table.toggleAllColumnsVisible(isVisible); // Use built-in function
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="切换列可见性"
          variant="outline"
          size="sm"
          className={cn("ml-auto h-9 hidden lg:flex", className)} // Use standard size, hide on small screens by default
        >
          <Settings2 className="mr-2 h-4 w-4" /> {/* Changed icon */}
          视图
          {hiddenColumnCount > 0 && (
            // Subtle badge to indicate hidden columns
            <Badge
              variant="secondary"
              className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-normal"
            >
              {hiddenColumnCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>切换列显示</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Add Show/Hide All buttons */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => toggleAllColumns(true)}
            disabled={hiddenColumnCount === 0} // Disable if all are visible
            className="text-xs justify-center cursor-pointer"
          >
            显示全部
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleAllColumns(false)}
            disabled={visibleColumnCount === 0} // Disable if all are hidden
            className="text-xs justify-center cursor-pointer"
          >
            隐藏全部
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* Scrollable group for individual columns */}
        <DropdownMenuGroup className="max-h-[250px] overflow-y-auto">
          {hideableColumns.map((column) => {
            // Attempt to get a display name, fallback to ID
            const columnTitle =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id.charAt(0).toUpperCase() + column.id.slice(1);

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* Show icon based on visibility state */}
                {column.getIsVisible() ? (
                  <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/80" />
                ) : (
                  <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/50" />
                )}
                <span className="truncate">{columnTitle}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
