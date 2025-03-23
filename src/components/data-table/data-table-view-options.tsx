"use client";

import * as React from "react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  MixerHorizontalIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
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
  const [open, setOpen] = React.useState(false);

  // 获取所有可隐藏的列
  const hideableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    );

  // 检查是否有可隐藏的列
  const hasHideableColumns = hideableColumns.length > 0;

  // 检查是否有任何列被隐藏
  const hasHiddenColumns = hideableColumns.some((col) => !col.getIsVisible());

  // 如果没有可隐藏的列，不渲染组件
  if (!hasHideableColumns) {
    return null;
  }

  // 切换所有列的可见性
  const toggleAllColumns = (isVisible: boolean) => {
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(isVisible);
      }
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`ml-auto h-8 lg:flex ${className || ""} ${
            hasHiddenColumns ? "bg-blue-50" : "bg-white"
          }`}
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4 text-gray-600" />
          视图选项
          {hasHiddenColumns && (
            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600">
              {hideableColumns.length -
                hideableColumns.filter((col) => col.getIsVisible()).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel className="font-medium">列显示</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[250px] overflow-y-auto">
          {hideableColumns.map((column) => {
            const columnTitle =
              column.id.charAt(0).toUpperCase() + column.id.slice(1);

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="capitalize py-1.5"
              >
                {column.getIsVisible() ? (
                  <EyeOpenIcon className="mr-2 h-4 w-4 text-gray-600" />
                ) : (
                  <EyeNoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm">{columnTitle}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => toggleAllColumns(true)}
            className="justify-center text-center text-sm font-medium"
          >
            显示全部
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleAllColumns(false)}
            className="justify-center text-center text-sm font-medium"
          >
            隐藏全部
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
