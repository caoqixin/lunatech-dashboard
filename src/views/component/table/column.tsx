"use client";
import type { Component } from "@/lib/types";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import type {
  DataTableHideColumn,
  DataTableSearchableColumn,
} from "@/components/data-table/type";
import { Skeleton } from "@/components/ui/skeleton";

import {
  EditableNameCell,
  EditableQualityCell,
  EditableStockCell,
  ComponentPriceCell,
  ComponentModelCell,
} from "../components/component-table-cells";

const ComponentActionWrapper = dynamic(
  () => import("@/views/component/components/component-action-wrapper"),
  {
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    ),
    ssr: false,
  }
);

export const componentColumns: ColumnDef<Component>[] = [
  {
    accessorKey: "code",
    header: "编号",
  },
  {
    accessorKey: "name",
    header: "名称",
    cell: (props) => (
      <EditableNameCell {...(props as CellContext<Component, string>)} />
    ),
    enableHiding: true,
    minSize: 180,
  },
  {
    accessorKey: "category",
    header: "分类",
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{(getValue() as string) ?? "-"}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "brand",
    header: "品牌",
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">{(getValue() as string) ?? "-"}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "quality",
    header: "品质",
    cell: (props) => (
      <EditableQualityCell {...(props as CellContext<Component, string>)} />
    ),
    enableHiding: true,
    minSize: 160,
  },
  {
    accessorKey: "model",
    header: "适配机型",
    cell: (props) => (
      <ComponentModelCell
        {...(props as CellContext<Component, string[] | null>)}
      />
    ),
    enableHiding: true,
    minSize: 200,
  },
  {
    accessorKey: "stock",
    header: () => {
      return <span className="text-nowrap">库存数量</span>;
    },
    cell: (props) => (
      <EditableStockCell {...(props as CellContext<Component, number>)} />
    ),
    enableHiding: true,
    size: 100,
  },
  {
    accessorKey: "public_price",
    header: "报价",
    cell: ({ row }) => <ComponentPriceCell value={row.original.public_price} />, // Read-only cell
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ComponentActionWrapper component={row.original} />;
    },
  },
];

export const componentSearchColumn: DataTableSearchableColumn<Component>[] = [
  { id: "name", placeholder: "搜索名称/别名/编号..." },
];

export const componentInitialHidenColumn: DataTableHideColumn<Component>[] = [
  { id: "brand", value: true },
  { id: "code", value: true },
];
