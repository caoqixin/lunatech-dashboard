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
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  /**
   * 表格实例
   */
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageSize, pageIndex } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  // 计算当前显示的行范围
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
      {/* 选中行信息 */}
      <div className="flex-1 text-sm text-gray-600">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <span>
            已选择 {table.getFilteredSelectedRowModel().rows.length} 行， 共{" "}
            {table.getFilteredRowModel().rows.length} 行
          </span>
        )}
        {table.getFilteredSelectedRowModel().rows.length === 0 && (
          <span>
            显示第 {startRow}-{endRow} 行， 共 {totalRows} 行
          </span>
        )}
      </div>

      {/* 分页控件 */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* 每页显示数量选择器 */}
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-600">每页行数</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 页码控件 */}
        <div className="flex items-center justify-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="首页"
            >
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="上一页"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="flex items-center gap-1 px-2">
              第 {pageIndex + 1} 页，共 {pageCount} 页
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="下一页"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="末页"
            >
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
