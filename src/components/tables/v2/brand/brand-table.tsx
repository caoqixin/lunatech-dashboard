"use client";

import { Brand } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { brandColumns, searchableColumns } from "./brand-columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";

interface BrandTableProps {
  data: {
    brands: Brand[];
    pageCount: number;
  };
}

export function BrandTable({ data }: BrandTableProps) {
  const { brands, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Brand, unknown>[]>(
    () => brandColumns,
    []
  );

  const { table } = useDataTable({
    data: brands,
    columns,
    pageCount,
    searchableColumns,
  });

  return (
    <DataTable table={table} columns={columns} searchKey={searchableColumns} />
  );
}
