"use client";

import { Badge } from "@/components/ui/badge";
import { RepairWithCustomer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { capitalizeName, toEUR } from "@/lib/utils";
import date from "@/lib/date";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load client components used in cells
const LazyShowMoreProblemButton = dynamic(
  () =>
    import("@/views/repair/components/show-more-problem-button").then(
      (mod) => mod.ShowMoreProblemButton
    ),
  { loading: () => <Skeleton className="h-7 w-10" />, ssr: false }
);
const LazyTableSelectStatus = dynamic(
  () =>
    import("@/views/repair/components/table-select-status").then(
      (mod) => mod.TableSelectStatus
    ),
  { loading: () => <Skeleton className="h-8 w-28" />, ssr: false }
);
const LazyRepairActionWrapper = dynamic(
  () =>
    import("@/views/repair/components/repair-action-wrapper").then(
      (mod) => mod.RepairActionWrapper
    ),
  {
    loading: () => (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    ),
    ssr: false,
  }
);

export const repairColumn: ColumnDef<RepairWithCustomer>[] = [
  {
    accessorKey: "customers.tel",
    id: "customerTel",
    header: "联系电话",
    cell: ({ row }) => {
      const name = row.original.customers?.name;
      const tel = row.original.customers?.tel;

      return (
        <div className="flex flex-col gap-y-0.5">
          <span className="font-mono font-medium">{tel ?? "-"}</span>
          {name && (
            <span className="text-xs text-muted-foreground">
              {capitalizeName(name)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => {
      return <span className="text-nowrap">手机型号</span>;
    },
    cell: ({ getValue }) => (
      <div className="font-medium truncate max-w-[150px]">
        {(getValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "problem",
    header: "维修故障",
    cell: ({ getValue, row }) => {
      const problems = getValue() as string[] | null;

      if (!problems || problems.length === 0)
        return (
          <Badge variant="secondary" className="text-xs">
            未指定
          </Badge>
        );
      return (
        <div className="flex items-center flex-wrap gap-1 max-w-[200px]">
          <Badge variant="outline" className="text-xs">
            {problems[0]}
          </Badge>
          {problems.length > 1 && (
            <LazyShowMoreProblemButton
              problems={problems}
              id={row.original.id}
              phone={row.original.phone}
            />
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
    cell: ({ row, getValue, table }) => {
      const tableMeta = table.options.meta as
        | { onSuccess?: () => void }
        | undefined;

      return (
        <LazyTableSelectStatus
          key={row.original.id} // Key needed for state management within cell
          initialValue={getValue()}
          id={row.original.id}
          isRework={row.original.isRework ?? false}
          onSuccess={tableMeta?.onSuccess} // Pass onSuccess from meta
        />
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ getValue }) => {
      const formatDate = date(getValue() as string).format("DD/MM/YYYY");
      return (
        <span className="font-mono text-xs whitespace-nowrap">
          {formatDate}
        </span>
      );
    },
  },
  {
    header: "应付款 (€)",
    cell: ({ row }) => {
      const { deposit, price, isRework } = row.original;

      const amountDue = price - deposit;

      return (
        <div className="flex flex-col items-end gap-y-0.5">
          <span className="font-mono font-semibold text-sm">
            {toEUR(price)}
          </span>
          {/* Show deposit and due amount subtly */}
          {!isRework && (
            <>
              <span className="text-xs text-muted-foreground">
                订金: {toEUR(deposit)}
              </span>
              {amountDue > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  应付: {toEUR(amountDue)}
                </span>
              )}
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const tableMeta = table.options.meta as
        | { onSuccess?: () => void }
        | undefined;
      return (
        <LazyRepairActionWrapper
          repair={row.original}
          onSuccess={tableMeta?.onSuccess}
        />
      );
    },
  },
];
