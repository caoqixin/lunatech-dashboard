import {
  ColumnDef,
  flexRender,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "./type";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "./data-table-skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface DataTableProps<TData, TValue> {
  /**
   * 由 useDataTable hook 返回的表格实例，包含分页、排序、过滤等功能
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  /**
   * 表格的列定义
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * 可搜索的表格列
   * @default []
   * @type DataTableSearchableColumn<TData>[]
   * @example searchableColumns={[{ id: "title", placeholder: "搜索标题..." }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];
  /**
   * 可过滤的表格列
   * @default []
   * @type DataTableFilterableColumn<TData>[]
   * @example filterableColumns={[{ id: "status", title: "状态", options: [{label: "待办", value: "todo"}] }]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];
  /**
   * 是否显示加载状态
   * @default false
   * @type boolean
   */
  isLoading?: boolean;

  /**
   * 无数据时显示的文本
   * @default "没有数据"
   * @type string
   */
  noDataText?: string;

  /**
   * 自定义样式类名
   * @type string
   */
  className?: string;
  showSkeletonInsideTable?: boolean;
}

/**
 * 基于 TanStack Table 的数据表格组件
 * 支持分页、排序、过滤和搜索等功能
 */
export function DataTable<TData, TValue>({
  table,
  columns,
  searchableColumns,
  filterableColumns,
  isLoading = false,
  noDataText = "没有找到相关数据",
  className,
  showSkeletonInsideTable = true, // Default to showing skeleton within table structure
}: DataTableProps<TData, TValue>) {
  // 提取行数据和表格状态
  const { getHeaderGroups, getRowModel } = table;
  const rows = getRowModel().rows;
  const hasData = rows?.length > 0;

  const isSelectionEnabled = table.options.enableRowSelection;
  // Don't render pagination if loading or no data and pagination is disabled
  const showPagination =
    !isLoading && hasData && table.options.manualPagination !== false;

  // Handle loading state - show skeleton
  if (isLoading && !showSkeletonInsideTable) {
    // Show skeleton as a replacement for the whole component if preferred
    return (
      <div className={cn("w-full", className)}>
        <DataTableSkeleton
          columnCount={columns.length}
          searchableColumnCount={searchableColumns?.length ?? 0}
          filterableColumnCount={filterableColumns?.length ?? 0}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-3", className)}>
      {" "}
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
      />
      {/* Table */}
      <div className="rounded-md border relative bg-card">
        {" "}
        {/* bg-card for context */}
        {isLoading && showSkeletonInsideTable && (
          // Show skeleton overlaid or structured within table borders
          <DataTableSkeleton
            columnCount={columns.length}
            rowCount={table.getState().pagination.pageSize} // Use current page size for skeleton rows
            showToolbar={false}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10" // Overlay style
          />
        )}
        {/* Use Shadcn Table component */}
        <ScrollArea
          className={cn(
            "w-full",
            isLoading &&
              showSkeletonInsideTable &&
              "opacity-30 pointer-events-none"
          )}
        >
          <Table className="min-w-full table-fixed md:table-auto">
            <TableHeader>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b"
                >
                  {headerGroup.headers.map((header) => (
                    // Apply text styles to header cell
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "h-11 px-3 text-left align-middle text-sm font-medium text-muted-foreground",
                        header.column.getCanSort() &&
                          "cursor-pointer select-none" // Indicate sortable headers
                      )}
                    >
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
              {/* Show no data message only if not loading */}
              {!isLoading && !hasData ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    // More prominent no-data state
                    className="h-48 text-center text-muted-foreground italic"
                  >
                    {noDataText}
                  </TableCell>
                </TableRow>
              ) : (
                // Render rows if not loading or if data exists
                // (isLoading && hasData) could mean background refresh, so still show rows
                rows.map((row, index) => (
                  <TableRow
                    key={row.id ?? `datatable-row-${index}`}
                    data-state={
                      isSelectionEnabled && row.getIsSelected()
                        ? "selected"
                        : undefined
                    }
                    className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/10" // Style selected rows
                  >
                    {row.getVisibleCells().map((cell) => (
                      // Standard cell padding
                      <TableCell key={cell.id} className="px-3 py-2.5 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {/* Pagination */}
      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}
