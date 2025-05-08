"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { RepairWithCustomer } from "@/lib/types";
import { repairColumn } from "@/views/repair/table/columns";
import { DataTable } from "@/components/data-table";

interface RepairTableProps {
  data: RepairWithCustomer[];
  count: number;
  isLoading?: boolean;
  refetchData?: () => void;
}

export const RepairTable = ({
  data,
  count,
  isLoading = false,
  refetchData,
}: RepairTableProps) => {
  const columns = useMemo<ColumnDef<RepairWithCustomer, unknown>[]>(
    () => repairColumn,
    []
  );
  const tableMeta = useMemo(
    () => ({
      onSuccess: refetchData, // Pass refetchData as onSuccess in meta
    }),
    [refetchData]
  );

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    pageCount: count ?? 0,
    meta: tableMeta,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      noDataText="暂无维修记录"
    />
  );
};
