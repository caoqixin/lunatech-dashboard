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
  isLoading?: boolean;
}

export const PhoneTable = ({ data, count, isLoading }: PhoneTableProps) => {
  const columns = useMemo<ColumnDef<Phone, unknown>[]>(() => phoneColumns, []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: phoneSearchColumns,
  });

  console.log(isLoading);

  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={phoneSearchColumns}
      isLoading={isLoading} // Pass loading state
      noDataText="未找到该品牌的手机型号"
    />
  );
};
