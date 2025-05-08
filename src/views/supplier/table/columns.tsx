"use client";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import type { Supplier } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const SupplierActionWrapper = dynamic(
  () => import("@/views/supplier/components/supplier-action-wrapper"),
  {
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-20" />
      </div>
    ),
    ssr: false,
  }
);

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "供应商名称",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "描述",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground truncate max-w-xs">
        {row.getValue("description") || "-"}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
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
