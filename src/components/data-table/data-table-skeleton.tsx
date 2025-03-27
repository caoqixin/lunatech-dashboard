"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  /**
   * 表格列数
   */
  columnCount: number;

  /**
   * 表格行数
   * @default 10
   */
  rowCount?: number;

  /**
   * 可搜索列数
   * @default 0
   */
  searchableColumnCount?: number;

  /**
   * 可过滤列数
   * @default 0
   */
  filterableColumnCount?: number;

  /**
   * 是否显示视图选项
   * @default true
   */
  showViewOptions?: boolean;

  /**
   * 自定义样式类名
   */
  className?: string;
}

/**
 * 数据表格加载骨架屏组件
 * 用于表格数据加载时显示
 */
export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  className,
}: DataTableSkeletonProps) {
  // 安全检查：确保列数和行数为正数
  const safeColumnCount = Math.max(1, columnCount);
  const safeRowCount = Math.max(1, rowCount);

  return (
    <div className={`w-full space-y-3 overflow-auto ${className || ""}`}>
      {/* 工具栏骨架 */}
      {(searchableColumnCount > 0 ||
        filterableColumnCount > 0 ||
        showViewOptions) && (
        <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
          <div className="flex flex-1 items-center space-x-2">
            {/* 搜索框骨架 */}
            {searchableColumnCount > 0 && (
              <>
                {Array.from({ length: searchableColumnCount }).map((_, i) => (
                  <Skeleton
                    key={`search-${i}`}
                    className="h-9 w-[150px] lg:w-[250px]"
                  />
                ))}
              </>
            )}

            {/* 过滤按钮骨架 */}
            {filterableColumnCount > 0 && (
              <>
                {Array.from({ length: filterableColumnCount }).map((_, i) => (
                  <Skeleton
                    key={`filter-${i}`}
                    className="h-8 w-[70px] rounded-md border-dashed"
                  />
                ))}
              </>
            )}
          </div>

          {/* 视图选项骨架 */}
          {showViewOptions && (
            <Skeleton className="ml-auto hidden h-8 w-[70px] rounded-md lg:flex" />
          )}
        </div>
      )}

      {/* 表格骨架 */}
      <div className="rounded-md border bg-background">
        <Table>
          {/* 表头骨架 */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {Array.from({ length: safeColumnCount }).map((_, i) => (
                <TableHead key={`head-${i}`}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* 表体骨架 */}
          <TableBody>
            {Array.from({ length: safeRowCount }).map((_, rowIndex) => (
              <TableRow
                key={`row-${rowIndex}`}
                className="hover:bg-transparent"
              >
                {Array.from({ length: safeColumnCount }).map((_, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页骨架 */}
      <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        {/* 选中行信息骨架 */}
        <div className="flex-1">
          <Skeleton className="h-4 w-40" />
        </div>

        {/* 分页控件骨架 */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          {/* 每页行数选择器骨架 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>

          {/* 页码信息骨架 */}
          <div className="flex w-[100px] items-center justify-center">
            <Skeleton className="h-4 w-24" />
          </div>

          {/* 分页按钮骨架 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="hidden size-8 rounded-md lg:block" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="hidden size-8 rounded-md lg:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
