"use client";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { Supplier } from "@/lib/types";

const SupplierActionWrapper = dynamic(
  () => import("@/views/supplier/components/supplier-action-wrapper"),
  { ssr: false }
);

export const supplierColumns: ColumnDef<Supplier>[] = [
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
      return (
        <SupplierActionWrapper supplier={row.original} key={row.original.id} />
      );
    },
  },
];
