"use client";

import { Supplier } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { supplierColumns } from "./supplier-columns";

interface SupplierTableProps {
  data: {
    suppliers: Supplier[];
    pageCount: number;
  };
}

export function SupplierTable({ data }: SupplierTableProps) {
  const { suppliers, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Supplier, unknown>[]>(
    () => supplierColumns,
    []
  );

  const { table } = useDataTable({
    data: suppliers,
    columns,
    pageCount,
  });

  return <DataTable table={table} columns={columns} />;
}
