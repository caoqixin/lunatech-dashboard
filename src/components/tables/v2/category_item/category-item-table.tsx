"use client";

import { CategoryItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { categoryItemColumns } from "./category-items-columns";

interface CategoryItemProps {
  data: {
    items: CategoryItem[];
    pageCount: number;
  };
}

export function CategoryItemTable({ data }: CategoryItemProps) {
  const { items, pageCount } = data;

  const columns = React.useMemo<ColumnDef<CategoryItem, unknown>[]>(
    () => categoryItemColumns,
    []
  );

  const { table } = useDataTable({
    data: items,
    columns,
    pageCount,
  });

  return <DataTable table={table} columns={columns} />;
}
