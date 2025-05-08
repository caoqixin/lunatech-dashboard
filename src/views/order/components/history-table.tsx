"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { Order } from "@/lib/types";
import { DataTable } from "@/components/data-table";
import { orderHistoryColumns } from "@/views/order/table/column";

interface HistoryTableProps {
  data: Order[];
  count: number;
  isLoading?: boolean;
}

export const HistoryTable = ({ data, count, isLoading }: HistoryTableProps) => {
  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
    () => orderHistoryColumns,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
  });

  return <DataTable table={table} columns={columns} isLoading={isLoading} />;
};
