"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { phoneColumns, phoneSearchColumns } from "@/views/phones/table/column";
import { Phone } from "@/lib/types";

interface PhoneTableProps {
  data: Phone[];
  count: number;
}

export const PhoneTable = ({ data, count }: PhoneTableProps) => {
  const columns = useMemo<ColumnDef<Phone, unknown>[]>(() => phoneColumns, []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: phoneSearchColumns,
  });

  return (
    <DataTable table={table} columns={columns} searchKey={phoneSearchColumns} />
  );
};
