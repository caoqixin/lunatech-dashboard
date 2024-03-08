"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repair } from "@/lib/definitions";
import { customers } from "@/lib/placeholder-data";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import RepairCellAction from "../actions/repairs/repair-cell-action";
import MoreProblem from "../actions/repairs/more-problem";
import SelectStatus from "../actions/repairs/select-status";

export const repairColumns: ColumnDef<Repair>[] = [
  {
    header: "联系方式",
    cell: ({ row }) => {
      const customerId = row.original.customerId;
      const customer = customers.filter((item) => item.id == customerId)[0];

      return <>{customer.tel}</>;
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
      const { id, status } = row.original;

      return <SelectStatus id={id} status={status} />;
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
      const { deposit, price } = row.original;

      const formattedNumber = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(price - (deposit ?? 0));

      return <>{formattedNumber}</>;
    },
  },
  {
    id: "操作",
    cell: ({ row }) => {
      const repair = row.original;

      return <RepairCellAction {...repair} />;
    },
  },
];
