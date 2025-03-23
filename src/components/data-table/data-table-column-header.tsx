"use client";

import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 表格列
   */
  column: Column<TData, TValue>;

  /**
   * 列标题
   */
  title: string;
}

/**
 * 数据表格列头部组件
 * 支持排序和显示/隐藏功能
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  // 当前列是否可排序
  const isSortable = column.getCanSort();
  // 当前列的排序状态
  const sortDirection = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="whitespace-nowrap">{title}</span>
      {isSortable ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : sortDirection === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="mr-2 h-3.5 w-3.5 text-gray-600" />
              <span>升序</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-gray-600" />
              <span>降序</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 h-3.5 w-3.5 text-gray-600" />
              <span>隐藏</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
