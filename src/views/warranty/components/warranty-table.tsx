"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table";
import type { Warranty } from "@/lib/types";
import {
  searchWarrantyColumn,
  warrantyColumn,
} from "@/views/warranty/table/columns";

interface WarrantyTableProps {
  data: Warranty[];
  count: number;
}

export const WarrantyTable = ({ data, count }: WarrantyTableProps) => {
  const columns = React.useMemo<ColumnDef<Warranty, unknown>[]>(
    () => warrantyColumn,
    []
  );

  const searchbleColumns = React.useMemo(() => searchWarrantyColumn, []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: searchbleColumns,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={searchWarrantyColumn}
      isLoading={!data}
      noDataText="未找到保修记录"
    />
  );
};
