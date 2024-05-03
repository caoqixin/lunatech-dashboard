"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "../data-table";
import { componentColumns, searchableColumns } from "./component-columns";
import { DataTableFilterableColumn } from "../types";
import { ClientComponent } from "@/lib/definitions";

interface ComponentTableProps {
  data: {
    components: ClientComponent[];
    pageCount: number;
  };
  filterColumn?: DataTableFilterableColumn<ClientComponent>[];
}

export function ComponentTable({ data, filterColumn }: ComponentTableProps) {
  const { components, pageCount } = data;

  const columns = React.useMemo<ColumnDef<ClientComponent, unknown>[]>(
    () => componentColumns,
    []
  );

  const { table } = useDataTable({
    data: components,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns: filterColumn,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchKey={searchableColumns}
      filterableColumns={filterColumn}
    />
  );
}
