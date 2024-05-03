"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import BrandCellAction from "./action/brand-cell-action";
import { Brand } from "@prisma/client";
import { DataTableSearchableColumn } from "../types";

export const brandColumns: ColumnDef<Brand>[] = [
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
      return <Link href={`/dashboard/phones/${id}`}>{name}</Link>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const brand = row.original;

      return <BrandCellAction key={brand.id} {...brand} />;
    },
  },
];

export const searchableColumns: DataTableSearchableColumn<Brand>[] = [
  {
    id: "name",
    placeholder: "输入品牌...",
  },
];
