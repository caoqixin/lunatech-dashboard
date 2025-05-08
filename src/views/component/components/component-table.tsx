"use client";

import { useMemo } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import type { Component } from "@/lib/types";
import {
  componentColumns,
  componentInitialHidenColumn,
  componentSearchColumn,
} from "@/views/component/table/column";
import type { DataTableFilterableColumn } from "@/components/data-table/type";

interface ComponentTableProps {
  data: Component[];
  count: number;
  filterColumn?: DataTableFilterableColumn<Component>[];
  isLoading?: boolean;
  refetchData?: () => void;
}

export const ComponentTable = ({
  data,
  count,
  filterColumn,
  isLoading,
  refetchData,
}: ComponentTableProps) => {
  const columns = useMemo<ColumnDef<Component, unknown>[]>(
    () => componentColumns,
    []
  );

  const searchableColumns = useMemo(() => componentSearchColumn, []);
  const initialHideColumns = useMemo(() => componentInitialHidenColumn, []);

  const tableMeta = useMemo(
    () => ({
      onSuccess: refetchData, // Pass refetchData as onSuccess in meta
    }),
    [refetchData]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: count,
    searchableColumns: searchableColumns,
    filterableColumns: filterColumn,
    initialHideColumns: initialHideColumns,
    meta: tableMeta,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={componentSearchColumn}
      filterableColumns={filterColumn}
      isLoading={isLoading}
      noDataText="未找到配件信息"
    />
  );
};
