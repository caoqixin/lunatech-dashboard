"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Customer } from "@/lib/types";
import {
  customerColumns,
  customerSearchColumn,
} from "@/views/customer/table/columns";

interface CustomerTableProps {
  data: Customer[];
  count: number;
}

export const CustomerTable = ({ data, count }: CustomerTableProps) => {
  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => customerColumns,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: customerSearchColumn,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchKey={customerSearchColumn}
    />
  );
};
