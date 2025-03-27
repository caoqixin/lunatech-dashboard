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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableFilterableColumn, DataTableSearchableColumn } from "./type";
import { cn } from "@/lib/utils";
import { DataTableSkeleton } from "./data-table-skeleton";

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
   * @example searchKey={[{ id: "title", placeholder: "搜索标题..." }]}
   */
  searchKey?: DataTableSearchableColumn<TData>[];
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
}

/**
 * 基于 TanStack Table 的数据表格组件
 * 支持分页、排序、过滤和搜索等功能
 */
export function DataTable<TData, TValue>({
  table,
  columns,
  searchKey,
  filterableColumns,
  isLoading = false,
  noDataText = "没有数据",
  className,
}: DataTableProps<TData, TValue>) {
  // 提取行数据和表格状态
  const { getHeaderGroups, getRowModel } = table;
  const rows = getRowModel().rows;
  const hasData = rows?.length > 0;

  return (
    <div className={cn(className, "space-y-4")}>
      {/* 工具栏 - 搜索、过滤等 */}
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        filterableColumns={filterableColumns}
      />

      {/* 表格主体 */}
      <div className="rounded-md border bg-background shadow-sm">
        {isLoading ? (
          <DataTableSkeleton columnCount={columns.length} />
        ) : (
          <Table>
            <TableHeader className="bg-background">
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-medium text-foreground"
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
              {hasData ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className="hover:bg-muted transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-foreground"
                  >
                    {noDataText}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 分页控件 */}
      {hasData && <DataTablePagination table={table} />}
    </div>
  );
}
