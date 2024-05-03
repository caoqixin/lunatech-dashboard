"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import CategoryCellAction from "./action/category-cell-action";
import { Category } from "@prisma/client";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "名称",
    cell: ({ row }) => {
      const { id, name } = row.original;
      return <Link href={`/dashboard/categories/${id}`}>{name}</Link>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, name } = row.original;

      return <CategoryCellAction key={id} id={id} name={name} />;
    },
  },
];
