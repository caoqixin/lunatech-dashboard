"use client";

import { Warranty } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ShowMoreProblemButton } from "@/views/warranty/components/show-more-problem-button";
import { ReworkButton } from "@/views/warranty/components/rework-button";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { DataTableSearchableColumn } from "@/components/data-table/type";

export const warrantyColumn: ColumnDef<Warranty>[] = [
  {
    id: "contact",
    header: () => <span className="font-semibold text-nowrap">联系人</span>,
    cell: ({ row }) => {
      const { repairs } = row.original;

      if (!repairs) return;

      const { customers } = repairs;

      if (!customers) return;

      const { name, tel } = customers;

      return (
        <div className="flex flex-col gap-y-2">
          <span className="font-mono font-bold">{tel}</span>
          <span className="font-mono text-muted-foreground">{name}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    filterFn: (row: Row<Warranty>, columnId, filterValue) => {
      console.log("Row data:", row.original);
      console.log("Filter value:", filterValue);
      const { repairs } = row.original;
      // console.log(columnId, filterValue);
      if (!repairs) return false;
      const { customers } = repairs;
      if (!customers) return false;

      if (columnId === "contact") {
        const { tel } = customers;
        console.log(filterValue);

        return tel.includes(filterValue);
      }
      return true;
    },
    size: 150,
  },
  {
    id: "phone",
    header: () => <span className="text-nowrap font-semibold">保修手机</span>,
    cell: ({ row }) => {
      const { repairs, id } = row.original;

      if (!repairs) return;

      const { phone, problem } = repairs;

      return (
        <div className="flex flex-col gap-y-2">
          <span className="font-mono font-bold">{phone}</span>
          {problem &&
            (problem.length > 1 ? (
              <div className="flex gap-2 w-44">
                <Badge variant="outline">{problem[0]}</Badge>
                <ShowMoreProblemButton
                  problems={problem}
                  id={id}
                  phone={phone}
                />
              </div>
            ) : (
              <Badge variant="outline" className="w-fit">
                {problem[0]}
              </Badge>
            ))}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <span className="font-semibold text-nowrap">保修开始日期</span>
    ),
    cell: ({ getValue }) => {
      const date = getValue() as string;
      return (
        <span className="font-mono">{dayjs(date).format("DD/MM/YYYY")}</span>
      );
    },
  },
  {
    accessorKey: "expiredAt",
    header: () => (
      <span className="font-semibold text-nowrap">保修结束日期</span>
    ),
    cell: ({ row }) => {
      const { days, expiredAt, createdAt } = row.original;

      const date = expiredAt ?? dayjs(createdAt).add(days ?? 0, "day");
      const isExpired = dayjs().isAfter(date);

      return (
        <div className="flex flex-col gap-y-2">
          <span
            className={cn(
              "font-bold",
              isExpired ? "text-red-600" : "text-green-400"
            )}
          >
            {isExpired ? "Scaduta Garanzia" : "In Garanzia"}
          </span>
          <span className="font-mono">{dayjs(date).format("DD/MM/YYYY")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reworkCount",
    header: () => <span className="font-semibold text-nowrap">已保次数</span>,
  },
  {
    id: "actions",
    cell: ({
      row: {
        original: { id },
      },
    }) => {
      return <ReworkButton id={id} />;
    },
  },
];

export const searchWarrantyColumn: DataTableSearchableColumn<Warranty>[] = [
  {
    id: "contact",
    placeholder: "输入客户联系方式",
  },
];
