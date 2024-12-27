"use client";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { CategoryType } from "@/views/category/schema/category.schema";
import { RepairProblem } from "@/lib/types";

const CategoryActionWrapper = dynamic(
  () => import("@/views/category/components/category-action-wrapper"),
  { ssr: false }
);

export const repairProblemColumn: ColumnDef<RepairProblem>[] = [
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <CategoryActionWrapper
          category={row.original}
          key={row.original.id}
          type={CategoryType.REPAIR}
        />
      );
    },
  },
];
