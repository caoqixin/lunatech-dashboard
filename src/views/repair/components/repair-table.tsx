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
}

export const RepairTable = ({ data, count }: RepairTableProps) => {
  const columns = React.useMemo<ColumnDef<RepairWithCustomer, unknown>[]>(
    () => repairColumn,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
  });

  if (data.length == 0) {
    return (
      <div className="w-full h-20 flex justify-center items-center">
        数据加载中 <i className="ml-4 animate-ping">...</i>
      </div>
    );
  }

  return <DataTable table={table} columns={columns} />;
};
