"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table";
import { Warranty } from "@/lib/types";
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

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: searchWarrantyColumn,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchKey={searchWarrantyColumn}
    />
  );
};
