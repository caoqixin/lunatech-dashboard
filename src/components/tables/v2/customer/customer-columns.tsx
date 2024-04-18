"use client";

import { ColumnDef } from "@tanstack/react-table";
import CustomerCellAction from "./action/customer-cell-action";
import { Customer } from "@prisma/client";
import { DataTableSearchableColumn } from "../types";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "名字",
  },
  {
    accessorKey: "tel",
    header: "联系号码",
  },
  {
    accessorKey: "email",
    header: "邮箱",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return <CustomerCellAction key={customer.id} {...customer} />;
    },
  },
];

export const searchableColumns: DataTableSearchableColumn<Customer>[] = [
  {
    id: "tel",
    placeholder: "搜索联系方式 ......",
  },
];
