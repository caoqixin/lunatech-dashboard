"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import RepairCellAction from "./action/repair-cell-action";
import MoreProblem from "./action/more-problem";
import SelectStatus from "./action/select-status";
import { useEffect, useState } from "react";
import { Customer, Repair } from "@prisma/client";
import { toEUR } from "@/lib/utils";

export const repairColumns: ColumnDef<Repair>[] = [
  {
    header: "联系方式",
    cell: ({ row }) => {
      const customerId = row.original.customerId;
      const [customer, setCustomer] = useState<Customer | null>(null);
      const getCustomer = async () => {
        const res = await fetch(
          `http://localhost:3000/api/v1/customers/${customerId}`
        );
        const data = await res.json();

        setCustomer(data);
      };
      useEffect(() => {
        getCustomer();
      }, []);

      return <>{customer?.tel}</>;
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

      return <RepairCellAction {...repair} />;
    },
  },
];
