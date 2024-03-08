"use client";
import { CategoryItem } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import CategoryItemsCellAction from "../actions/categoryItems/category-items-cell-action";

export const categoryItemColumns: ColumnDef<CategoryItem>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const categoryItems = row.original;

      return <CategoryItemsCellAction {...categoryItems} />;
    },
  },
];
