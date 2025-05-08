"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { supplierColumns } from "@/views/supplier/table/columns";
import { DataTable } from "@/components/data-table";
import { Supplier } from "@/lib/types";

interface SupplierTableProps {
  data: Supplier[];
  count: number;
  isLoading?: boolean;
}

export const SupplierTable = ({
  data,
  count,
  isLoading,
}: SupplierTableProps) => {
  const columns = useMemo<ColumnDef<Supplier, unknown>[]>(
    () => supplierColumns,
    []
  );

  const { table } = useDataTable({
    data: data ?? [],
    columns,
    pageCount: count ?? 0,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      noDataText="未找到供应商信息"
    />
  );
};
