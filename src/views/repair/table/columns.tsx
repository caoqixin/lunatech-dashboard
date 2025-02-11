"use client";

import { Badge } from "@/components/ui/badge";
import { RepairWithCustomer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ShowMoreProblemButton } from "@/views/repair/components/show-more-problem-button";
import { TableSelectStatus } from "@/views/repair/components/table-select-status";
import { RepairActionWrapper } from "@/views/repair/components/repair-action-wrapper";
import { toEUR } from "@/lib/utils";
import date from "@/lib/date";

export const repairColumn: ColumnDef<RepairWithCustomer>[] = [
  {
    accessorKey: "customers.tel",
    header: "联系方式",
    cell: ({ getValue }) => {
      const tel = getValue();

      return (
        <span
          className="font-semibold font-mono text-lg w-[10ch]
         cursor-pointer"
        >
          {tel as string}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => {
      return <span className="text-nowrap">手机型号</span>;
    },
    cell: ({ getValue }) => {
      const phone = getValue();

      return (
        <span className="font-mono cursor-pointer">{phone as string}</span>
      );
    },
  },
  {
    accessorKey: "problem",
    header: "维修故障",
    cell: ({ getValue, row }) => {
      const problems = getValue() as string[];
      return (
        <div>
          {problems ? (
            problems.length > 1 ? (
              <div className="flex gap-2 w-44">
                <Badge variant="outline">{problems[0]}</Badge>
                <ShowMoreProblemButton
                  problems={problems}
                  id={row.original.id}
                  phone={row.original.phone}
                />
              </div>
            ) : (
              <Badge variant="outline">{problems[0]}</Badge>
            )
          ) : (
            <Badge variant="outline">通用</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <span className="text-nowrap">维修状态</span>;
    },
    cell: ({ row, getValue }) => {
      const value = getValue();
      const { id, isRework } = row.original;

      return (
        <TableSelectStatus
          key={id}
          initialValue={value}
          id={id}
          isRework={isRework}
        />
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ getValue }) => {
      const formatDate = date(getValue() as string).format("DD/MM/YYYY");
      return <span className="font-mono text-sm">{formatDate}</span>;
    },
  },
  {
    header: "应付款",
    cell: ({ row }) => {
      const { deposit, price, isRework } = row.original;

      const formattedNumber = toEUR(price - deposit);

      return (
        <span className="font-mono font-bold text-lg text-left">
          {!isRework && formattedNumber}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <RepairActionWrapper repair={row.original} />;
    },
  },
];
