"use client";
import type { DataTableSearchableColumn } from "@/components/data-table/type";
import { Checkbox } from "@/components/ui/checkbox";
import type { Phone } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Dynamic import for actions
const PhoneActionWrapper = dynamic(
  () => import("@/views/phones/components/phone-action-wrapper"), // Adjust path
  {
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-16" />
      </div>
    ),
    ssr: false,
  }
);

export const phoneColumns: ColumnDef<Phone>[] = [
  {
    accessorKey: "name",
    header: "手机名称",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "code",
    header: "代号/标识",
    cell: ({ row }) => (
      <div>
        {row.getValue("code") ?? (
          <span className="text-muted-foreground italic">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isTablet",
    header: "平板设备",
    cell: ({ row }) => {
      const isTablet = row.original.isTablet;

      return isTablet ? (
        <Badge variant="secondary">平板</Badge>
      ) : (
        <Badge variant="outline">手机</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <PhoneActionWrapper phone={row.original} />;
    },
  },
];

export const phoneSearchColumns: DataTableSearchableColumn<Phone>[] = [
  {
    id: "name",
    placeholder: "搜索手机型号, 请输入手机型号 ......",
  },
];
