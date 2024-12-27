"use client";
import { DataTableSearchableColumn } from "@/components/data-table/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";

const PhoneActionWrapper = dynamic(
  () => import("@/views/phones/components/phone-action-wrapper"),
  { ssr: false }
);

export const phoneColumns: ColumnDef<Phone>[] = [
  {
    accessorKey: "name",
    header: "手机名称",
  },
  {
    accessorKey: "code",
    header: "手机代号",
  },
  {
    accessorKey: "isTablet",
    header: "平板设备",
    cell: ({ row }) => {
      const isTablet = row.original.isTablet;

      return (
        <Checkbox checked={isTablet} disabled className="ml-4 cursor-pointer" />
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
