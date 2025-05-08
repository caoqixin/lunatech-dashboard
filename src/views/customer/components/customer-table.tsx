"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { Customer } from "@/lib/types";
import {
  customerColumns,
  customerHiddenColumns,
  customerSearchableColumns,
} from "@/views/customer/table/columns";

interface CustomerTableProps {
  data: Customer[];
  count: number;
  isLoading?: boolean;
}

export const CustomerTable = ({
  data,
  count,
  isLoading,
}: CustomerTableProps) => {
  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => customerColumns,
    []
  );

  // Memoizing searchable columns avoids recreating on every render
  const searchableColumns = useMemo(() => customerSearchableColumns, []);
  const initialHiddenColumns = useMemo(() => customerHiddenColumns, []);

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    pageCount: count ?? 0,
    searchableColumns: searchableColumns,
    initialHideColumns: initialHiddenColumns,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={searchableColumns}
      isLoading={isLoading}
      noDataText="未找到客户信息"
    />
  );
};
