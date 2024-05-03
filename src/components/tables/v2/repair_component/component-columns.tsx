"use client";

import { ColumnDef } from "@tanstack/react-table";
import ComponentCellAction from "./action/component-cell-action";
import { toEUR } from "@/lib/utils";
import { Component } from "@prisma/client";
import { DataTableSearchableColumn } from "../types";
import { ClientComponent } from "@/lib/definitions";

export const componentColumns: ColumnDef<ClientComponent>[] = [
  {
    accessorKey: "code",
    header: "编号",
  },
  {
    accessorKey: "name",
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
    cell: ({ row }) => {
      const public_price = row.original.public_price;

      return <>{toEUR(public_price)}</>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const component = row.original;

      return <ComponentCellAction key={component.id} {...component} />;
    },
  },
];

export const searchableColumns: DataTableSearchableColumn<ClientComponent>[] = [
  {
    id: "name",
    placeholder: "输入配件名称",
  },
];
