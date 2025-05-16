import type { SellStock } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useMemo } from "react";
import {
  sellStockColumn,
  sellStockFilterableColumn,
  sellStockSearchColumn,
} from "../table/columns";
import { DataTable } from "@/components/data-table";

interface SellStockTableProps {
  data: SellStock[];
  count: number;
  isLoading?: boolean;
  onSuccessAction?: () => void; // Callback for cell actions that update data
}

export const SellStockTable: React.FC<SellStockTableProps> = ({
  // Rename for clarity if this is specific
  data,
  count,
  isLoading,
  onSuccessAction,
}) => {
  const tableMeta = useMemo(
    () => ({ onSuccess: onSuccessAction }),
    [onSuccessAction]
  );
  const columns = useMemo<ColumnDef<SellStock, unknown>[]>(
    () => sellStockColumn,
    []
  );

  const searchColumns = useMemo(() => sellStockSearchColumn, []);
  const filterColumns = useMemo(() => sellStockFilterableColumn, []);

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    pageCount: count ?? 0,
    meta: tableMeta,
    searchableColumns: searchColumns,
    filterableColumns: filterColumns,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      noDataText="未找到可售配件"
      searchableColumns={searchColumns}
      filterableColumns={filterColumns}
    />
  );
};
