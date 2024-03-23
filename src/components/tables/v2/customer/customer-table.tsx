"use client";

import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { customerColumns, searchableColumns } from "./customer-columns";

interface CustomerTableProps {
  data: {
    customers: Customer[];
    pageCount: number;
  };
}

export function CustomerTable({ data }: CustomerTableProps) {
  const { customers, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Customer, unknown>[]>(
    () => customerColumns,
    []
  );

  const { table } = useDataTable({
    data: customers,
    columns,
    pageCount,
    searchableColumns,
  });

  return (
    <DataTable table={table} columns={columns} searchKey={searchableColumns} />
  );
}
