"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import CategoryCellAction from "../actions/category/category-cell-action";
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
      const id = row.getValue("id");
      const value: string = row.getValue("name");
      return <Link href={`/dashboard/categories/${id}`}>{value}</Link>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return <CategoryCellAction {...category} />;
    },
  },
];
