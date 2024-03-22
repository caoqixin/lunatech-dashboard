"use client";

import { ColumnDef } from "@tanstack/react-table";
import CustomerCellAction from "../actions/cusotmer/customer-cell-action";
import { Customer } from "@prisma/client";

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
      const phone = row.original;

      return <CustomerCellAction {...phone} />;
    },
  },
];
