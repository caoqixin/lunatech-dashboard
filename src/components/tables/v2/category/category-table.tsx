"use client";
import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { categoryColumns } from "./category-columns";
import { DataTable } from "../data-table";
import { useDataTable } from "@/hooks/use-data-table";

interface CategoryTableProps {
  data: {
    categories: Category[];
    pageCount: number;
  };
}

export function CategoryTable({ data }: CategoryTableProps) {
  const { categories, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Category, unknown>[]>(
    () => categoryColumns,
    []
  );

  const { table } = useDataTable({
    data: categories,
    columns,
    pageCount,
  });

  return <DataTable table={table} columns={columns} />;
}
