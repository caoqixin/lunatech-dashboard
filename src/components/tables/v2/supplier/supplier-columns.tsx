"use client";
import { ColumnDef } from "@tanstack/react-table";
import SupplierCellAction from "./action/supplier-cell-action";
import { Supplier } from "@prisma/client";
import { DataTableColumnHeader } from "../../data-table-column-header";

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "供应商名称",
  },
  {
    accessorKey: "description",
    header: "描述",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return <SupplierCellAction key={supplier.id} {...supplier} />;
    },
  },
];
