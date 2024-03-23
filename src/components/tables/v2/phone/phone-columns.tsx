"use client";
import { ColumnDef } from "@tanstack/react-table";
import PhoneCellAction from "./action/phone-cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone } from "@prisma/client";
import { DataTableSearchableColumn } from "../types";

export const phoneColumns: ColumnDef<Phone>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    accessorKey: "code",
    header: "型号",
  },
  {
    accessorKey: "isTablet",
    header: "平板设备",
    cell: ({ row }) => {
      const isTablet = row.getValue("isTablet") as boolean;

      return <Checkbox checked={isTablet} disabled />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const phone = row.original;

      return <PhoneCellAction {...phone} />;
    },
  },
];

export const searchableColumns: DataTableSearchableColumn<Phone>[] = [
  {
    id: "name",
    placeholder: "输入手机型号...",
  },
];
