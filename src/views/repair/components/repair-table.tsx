"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { RepairWithCustomer } from "@/lib/types";
import { repairColumn } from "@/views/repair/table/columns";
import { DataTable } from "@/components/data-table";

interface RepairTableProps {
  data: RepairWithCustomer[];
  count: number;
  isLoading?: boolean;
}

export const RepairTable = ({
  data,
  count,
  isLoading = false,
}: RepairTableProps) => {
  const columns = React.useMemo<ColumnDef<RepairWithCustomer, unknown>[]>(
    () => repairColumn,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.max(1, count),
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      noDataText="暂无维修记录"
    />
  );
};
