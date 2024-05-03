"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import RepairCellAction from "./action/repair-cell-action";
import SelectStatus from "./action/select-status";
import { toEUR } from "@/lib/utils";
import CustomerInfo from "./action/customer-info";
import dynamic from "next/dynamic";
import { ClientRepiar } from "@/lib/definitions";

const MoreProblem = dynamic(
  () => import("@/components/tables/v2/repair/action/more-problem")
);

export const repairColumns: ColumnDef<ClientRepiar>[] = [
  {
    header: "联系方式",
    cell: ({ row }) => {
      const customerId = row.original.customerId;

      return <CustomerInfo customerId={customerId} />;
    },
  },
  {
    accessorKey: "phone",
    header: "手机型号",
  },
  {
    accessorKey: "problem",
    header: "维修问题",
    cell: ({ row }) => {
      const problems = row.getValue("problem") as string[];
      return (
        <div className="flex flex-col gap-1">
          {problems.length <= 2 ? (
            problems.map((problem) => (
              <Badge variant="outline" key={problem} className="rounded-md">
                {problem}
              </Badge>
            ))
          ) : (
            <>
              <Badge variant="outline" className="rounded-md">
                {problems[0]}
              </Badge>
              <MoreProblem problems={problems} />
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const { id, status, isRework } = row.original;

      return <SelectStatus id={id} status={status} isRework={isRework} />;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      const formatDate = dayjs(date).format("DD/MM/YYYY");
      return <>{formatDate}</>;
    },
  },
  {
    header: "应付款",
    cell: ({ row }) => {
      const { deposit, price, isRework } = row.original;

      const formattedNumber = toEUR(
        parseFloat(price.toString()) - (parseFloat(deposit.toString()) ?? 0)
      );

      return <>{!isRework && formattedNumber}</>;
    },
  },
  {
    id: "操作",
    cell: ({ row }) => {
      const repair = row.original;

      return <RepairCellAction key={repair.id} {...repair} />;
    },
  },
];
