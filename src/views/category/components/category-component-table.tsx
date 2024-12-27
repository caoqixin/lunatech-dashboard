"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { categoryComponentColumn } from "@/views/category/table/category-component-column";
import { CategoryComponent } from "@/lib/types";

interface CategoryComponentTableProps {
  data: CategoryComponent[];
  count: number;
}

export const CategoryComponentTable = ({
  data,
  count,
}: CategoryComponentTableProps) => {
  const columns = useMemo<ColumnDef<CategoryComponent, unknown>[]>(
    () => categoryComponentColumn,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
  });

  return <DataTable table={table} columns={columns} />;
};
