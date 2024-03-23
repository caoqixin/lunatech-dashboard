"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { Repair } from "@prisma/client";
import { repairColumns } from "./repair-columns";

interface RepairTableProps {
  data: {
    repairs: Repair[];
    pageCount: number;
  };
}

export function RepairTable({ data }: RepairTableProps) {
  const { repairs, pageCount } = data;

  const columns = React.useMemo<ColumnDef<Repair, unknown>[]>(
    () => repairColumns,
    []
  );

  const { table } = useDataTable({
    data: repairs,
    columns,
    pageCount,
  });

  return <DataTable table={table} columns={columns} />;
}
