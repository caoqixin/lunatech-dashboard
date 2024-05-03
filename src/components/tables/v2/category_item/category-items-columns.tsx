"use client";
import { ColumnDef } from "@tanstack/react-table";
import CategoryItemsCellAction from "./action/category-items-cell-action";
import { CategoryItem } from "@prisma/client";

export const categoryItemColumns: ColumnDef<CategoryItem>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, name } = row.original;

      return <CategoryItemsCellAction key={id} id={id} name={name} />;
    },
  },
];
