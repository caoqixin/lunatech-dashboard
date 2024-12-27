"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { repairProblemColumn } from "@/views/category/table/repair-problem-column";
import { RepairProblem } from "@/lib/types";

interface RepairProblemTableProps {
  data: RepairProblem[];
  count: number;
}

export const RepairProblemTable = ({
  data,
  count,
}: RepairProblemTableProps) => {
  const columns = useMemo<ColumnDef<RepairProblem, unknown>[]>(
    () => repairProblemColumn,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
  });

  return <DataTable table={table} columns={columns} />;
};
