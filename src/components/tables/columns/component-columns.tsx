"use client";

import { RepairComponent } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import ComponentCellAction from "../actions/component/component-cell-action";

export const componentColumns: ColumnDef<RepairComponent>[] = [
  {
    accessorKey: "code",
    header: "编号",
  },
  {
    accessorKey: "category",
    header: "分类",
  },
  {
    accessorKey: "quality",
    header: "品质",
  },
  {
    accessorKey: "model",
    header: "适配机型",
  },
  {
    accessorKey: "stock",
    header: "库存数量",
  },
  {
    accessorKey: "public_price",
    header: "报价",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const component = row.original;

      return <ComponentCellAction {...component} />;
    },
  },
];
