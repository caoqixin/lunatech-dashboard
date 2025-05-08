"use client";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import type { Customer } from "@/lib/types";
import type {
  DataTableHideColumn,
  DataTableSearchableColumn,
} from "@/components/data-table/type";
import { capitalizeName } from "@/lib/utils";

const CustomerActionWrapper = dynamic(
  () => import("@/views/customer/components/customer-action-wrapper"),
  { ssr: false }
);

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "客户名称",
    cell: ({ row }) => (
      <div className="font-medium">
        {capitalizeName(row.getValue("name") as string)}
      </div>
    ),
  },
  {
    accessorKey: "tel",
    header: "电话号码",
    cell: ({ row }) => <div>{row.getValue("tel")}</div>,
  },
  {
    accessorKey: "email",
    header: "邮箱",
    cell: ({ row }) => <div>{row.getValue("email") ?? "-"}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CustomerActionWrapper customer={row.original} />;
    },
  },
];

export const customerSearchableColumns: DataTableSearchableColumn<Customer>[] =
  [
    {
      id: "tel",
      placeholder: "搜索客户, 请输入手机号码 ......",
    },
  ];

export const customerHiddenColumns: DataTableHideColumn<Customer>[] = [
  {
    id: "email",
    value: true,
  },
];
