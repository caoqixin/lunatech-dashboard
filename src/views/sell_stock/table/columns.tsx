"use client";

import type { SellStock } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { cn, toEUR } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/components/data-table/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  ClickableImagePreviewCell,
  EditableSellStockQuantityCell,
} from "../components/sell-stock-table-cells";
import { SELLABLE_ITEM_CATEGORIES } from "@/lib/constants";

const SellStockActionWrapper = dynamic(
  () =>
    import("../components/sell_stock_action_wrapper").then(
      (mod) => mod.SellStockActionWrapper
    ), // Create this component
  {
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    ),
    ssr: false,
  }
);

export const sellStockColumn: ColumnDef<SellStock>[] = [
  {
    accessorKey: "image_url",
    header: "预览图",
    cell: (props) => (
      <ClickableImagePreviewCell
        {...(props as CellContext<SellStock, string | null | undefined>)}
      />
    ),
    size: 70,
  },
  {
    accessorKey: "id",
    header: "商品ID",
    cell: ({ getValue }) => (
      <div className="font-mono text-xs whitespace-nowrap">
        {getValue() as string}
      </div>
    ),
    minSize: 150,
  },
  {
    accessorKey: "name",
    header: "商品名称",
    cell: ({ getValue }) => (
      <div className="font-medium truncate max-w-[200px] sm:max-w-[250px]">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "分类",
    cell: ({ getValue }) => {
      const category = getValue() as string | null;
      return category ? (
        <Badge variant="secondary" className="whitespace-nowrap text-xs">
          {category}
        </Badge>
      ) : (
        <span className="text-muted-foreground italic text-xs">未分类</span>
      );
    },
  },
  {
    accessorKey: "supplier_name",
    header: "供应商",
    cell: ({ getValue }) => (
      <div className="text-sm whitespace-nowrap">
        {(getValue() as string) ?? (
          <span className="text-muted-foreground italic">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "库存",
    cell: (props) => (
      <EditableSellStockQuantityCell
        {...(props as CellContext<SellStock, number>)}
      />
    ),
    size: 120,
  },
  {
    accessorKey: "purchase_price",
    header: "进价 (€)",
    cell: ({ getValue }) => (
      <div className="font-mono text-xs text-right whitespace-nowrap">
        {toEUR(getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "selling_price",
    header: "零售价 (€)",
    cell: ({ getValue }) => (
      <div className="font-mono text-sm text-right font-semibold whitespace-nowrap">
        {toEUR(getValue() as number)}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      // Access meta if onSuccess is passed through table options
      const tableMeta = table.options.meta as
        | { onSuccess?: () => void }
        | undefined;
      return (
        <SellStockActionWrapper
          item={row.original}
          onSuccess={tableMeta?.onSuccess}
        />
      );
    },
  },
];

export const sellStockSearchColumn: DataTableSearchableColumn<SellStock>[] = [
  { id: "name", placeholder: "搜索名称/编号..." },
];

export const sellStockFilterableColumn: DataTableFilterableColumn<SellStock>[] =
  [
    {
      id: "category",
      title: "分类",
      options: SELLABLE_ITEM_CATEGORIES.map((category) => ({
        label: category.zh_alias,
        value: category.name.toLowerCase(),
      })),
    },
  ];
