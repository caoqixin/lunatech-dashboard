"use client";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { Customer } from "@/lib/types";
import { DataTableSearchableColumn } from "@/components/data-table/type";

const CustomerActionWrapper = dynamic(
  () => import("@/views/customer/components/customer-action-wrapper"),
  { ssr: false }
);

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "客户名称",
  },
  {
    accessorKey: "tel",
    header: "电话号码",
  },
  {
    accessorKey: "email",
    header: "邮箱",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CustomerActionWrapper customer={row.original} />;
    },
  },
];

export const customerSearchColumn: DataTableSearchableColumn<Customer>[] = [
  {
    id: "tel",
    placeholder: "搜索客户, 请输入手机号码 ......",
  },
];
