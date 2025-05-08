"use client";

import type { Warranty } from "@/lib/types";
import type { DataTableSearchableColumn } from "@/components/data-table/type";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import date from "@/lib/date";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { capitalizeName } from "@/lib/utils";

const LazyShowMoreProblemButton = dynamic(
  () =>
    import("@/views/warranty/components/show-more-problem-button").then(
      (mod) => mod.ShowMoreProblemButton
    ),
  {
    loading: () => <Skeleton className="h-7 w-12" />,
    ssr: false,
  }
);

const LazyReworkButton = dynamic(
  () =>
    import("@/views/warranty/components/rework-button").then(
      (mod) => mod.ReworkButton
    ),
  {
    loading: () => <Skeleton className="h-9 w-20" />,
    ssr: false,
  }
);

export const warrantyColumn: ColumnDef<Warranty>[] = [
  {
    accessorKey: "repairs.customers.tel",
    id: "contact",
    header: () => <span className="font-semibold text-nowrap">联系人</span>,
    cell: ({ row }) => {
      const name = row.original.repairs?.customers?.name;
      const tel = row.original.repairs?.customers?.tel;

      if (!tel && !name)
        return <span className="text-muted-foreground">-</span>;

      return (
        <div className="flex flex-col gap-y-1">
          <span className="font-mono font-semibold text-sm">
            {tel || "无号码"}
          </span>
          {name && (
            <span className="text-xs text-muted-foreground">
              {capitalizeName(name)}
            </span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
    meta: {
      // Custom meta for potential use later (e.g., filtering strategy)
      searchKey: "tel",
    },
    size: 150,
  },
  {
    accessorKey: "repairs.phone",
    id: "phoneInfo",
    header: () => (
      <span className="text-nowrap font-semibold">保修手机与问题</span>
    ),
    cell: ({ row }) => {
      const phone = row.original.repairs?.phone;
      const problems = row.original.repairs?.problem; // Might be null or empty array
      const warrantyId = row.original.id;

      if (!phone) return <span className="text-muted-foreground">-</span>;

      // Ensure 'problems' is an array before processing
      const problemList = Array.isArray(problems) ? problems : [];

      return (
        <div className="flex flex-col gap-y-1.5 max-w-[250px]">
          {" "}
          {/* Max width to prevent overflow */}
          <span className="font-medium text-sm truncate">{phone}</span>{" "}
          {/* Truncate long phone names */}
          {problemList.length > 0 && ( // Check if there are any problems
            <div className="flex flex-wrap items-center gap-1">
              {" "}
              {/* Use flex-wrap */}
              {/* Display first problem directly */}
              <Badge variant="outline" className="text-xs">
                {problemList[0]}
              </Badge>
              {/* Show 'more' button only if there's more than one */}
              {problemList.length > 1 && (
                <LazyShowMoreProblemButton // Use lazy loaded component
                  problems={problemList}
                  id={warrantyId}
                  phone={phone}
                />
              )}
            </div>
          )}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="font-semibold text-nowrap">保修开始</span>,
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? (
        <span className="font-mono text-sm whitespace-nowrap">
          {date(value as string).format("DD/MM/YYYY")} {/* Standard format */}
        </span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "expiryStatus",
    header: () => (
      <span className="font-semibold text-nowrap">保修状态与到期日</span>
    ),
    cell: ({ row }) => {
      const { days, expiredAt, createdAt } = row.original;

      // Calculate expiry time, default to createdAt if no expiry or days given
      const expiryTime = expiredAt
        ? date(expiredAt)
        : createdAt && typeof days === "number" && days >= 0
        ? date(createdAt).add(days, "day")
        : date(createdAt); // Fallback to creation date if calculation not possible

      const now = date();
      const isValidDate = expiryTime.isValid();
      const isExpired = isValidDate && now.isAfter(expiryTime);

      return (
        <div className="flex flex-col gap-y-1">
          <Badge
            variant={isExpired ? "destructive" : "default"}
            className="w-fit text-xs"
          >
            {isExpired ? "已过期" : "保修中"}
          </Badge>
          {/* Display date only if valid */}
          {isValidDate ? (
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
              到期: {expiryTime.format("YYYY-MM-DD")}
            </span>
          ) : (
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
              日期无效
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "reworkCount",
    header: () => <span className="font-semibold text-nowrap">返修次数</span>,
    cell: ({ getValue }) => {
      const count = getValue() as number;
      return <div className="text-center font-medium">{count ?? 0}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expiryTime = row.original.expiredAt
        ? date(row.original.expiredAt)
        : row.original.createdAt &&
          typeof row.original.days === "number" &&
          row.original.days >= 0
        ? date(row.original.createdAt).add(row.original.days, "day")
        : date(row.original.createdAt);
      const isExpired = !expiryTime.isValid() || date().isAfter(expiryTime);

      // Conditionally render button only if not expired
      return (
        <div className="text-right">
          {!isExpired ? (
            <LazyReworkButton id={row.original.id} />
          ) : (
            <span className="text-xs text-muted-foreground italic">已过期</span>
          )}
        </div>
      );
    },
  },
];

export const searchWarrantyColumn: DataTableSearchableColumn<Warranty>[] = [
  {
    id: "contact",
    placeholder: "输入客户电话号码搜索...",
  },
];
