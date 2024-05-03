"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { repairColumns } from "./repair-columns";
import { ClientRepiar } from "@/lib/definitions";

interface RepairTableProps {
  data: {
    repairs: ClientRepiar[];
    pageCount: number;
  };
}

export function RepairTable({ data }: RepairTableProps) {
  const { repairs, pageCount } = data;

  const columns = React.useMemo<ColumnDef<ClientRepiar, unknown>[]>(
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
