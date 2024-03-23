"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { WarrantyWithRepair } from "@/lib/definitions";
import { searchableColumns, warrantyColumns } from "./warranty-columns";

interface WarrantyTableProps {
  data: {
    warranties: WarrantyWithRepair[];
    pageCount: number;
  };
}

export function WarrantyTable({ data }: WarrantyTableProps) {
  const { warranties, pageCount } = data;

  const columns = React.useMemo<ColumnDef<WarrantyWithRepair, unknown>[]>(
    () => warrantyColumns,
    []
  );

  const { table } = useDataTable({
    data: warranties,
    columns,
    pageCount,
    searchableColumns,
  });

  return (
    <DataTable table={table} columns={columns} searchKey={searchableColumns} />
  );
}
