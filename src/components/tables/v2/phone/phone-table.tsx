"use client";

import { Phone } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { phoneColumns, searchableColumns } from "./phone-columns";

interface PhoneTableProps {
  data: {
    items: Phone[];
    pageCount: number;
  };
}

export function PhoneTable({ data }: PhoneTableProps) {
  const { items, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Phone, unknown>[]>(
    () => phoneColumns,
    []
  );

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount,
    searchableColumns,
  });

  return (
    <DataTable table={table} columns={columns} searchKey={searchableColumns} />
  );
}
