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
}

export const SupplierTable = ({ data, count }: SupplierTableProps) => {
  const columns = useMemo<ColumnDef<Supplier, unknown>[]>(
    () => supplierColumns,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
  });

  return <DataTable table={table} columns={columns} />;
};
