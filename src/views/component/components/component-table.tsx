"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Component } from "@/lib/types";
import {
  componentColumns,
  componentInitialHidenColumn,
  componentSearchColumn,
} from "@/views/component/table/column";
import { DataTableFilterableColumn } from "@/components/data-table/type";

interface ComponentTableProps {
  data: Component[];
  count: number;
  filterColumn?: DataTableFilterableColumn<Component>[];
}

export const ComponentTable = ({
  data,
  count,
  filterColumn,
}: ComponentTableProps) => {
  const columns = useMemo<ColumnDef<Component, unknown>[]>(
    () => componentColumns,
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: componentSearchColumn,
    filterableColumns: filterColumn,
    initialHideColumns: componentInitialHidenColumn,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchKey={componentSearchColumn}
      filterableColumns={filterColumn}
    />
  );
};
