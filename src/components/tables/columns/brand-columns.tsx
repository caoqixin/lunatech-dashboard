"use client";
import { Brand } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import BrandCellAction from "../actions/brand/brand-cell-action";

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
      const id = row.getValue("id");
      const value: string = row.getValue("name");
      return <Link href={`/dashboard/phones/${id}`}>{value}</Link>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const brand = row.original;

      return <BrandCellAction {...brand} />;
    },
  },
];
