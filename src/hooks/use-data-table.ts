"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  DataTableFilterableColumn,
  DataTableHideColumn,
  DataTableSearchableColumn,
} from "@/components/data-table/type";
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  TableMeta,
} from "@tanstack/react-table";
import { z } from "zod";

import { useDebounce } from "@/hooks/use-debounce";

interface UseDataTableProps<TData, TValue> {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[];

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number;

  /**
   * The searchable columns of the table.
   * @default []
   * @type {id: keyof TData, title: string}[]
   * @example searchableColumns={[{ id: "title", title: "titles" }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[];

  /**
   * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
   * @default []
   * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]}[]
   * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[];
  initialHideColumns?: DataTableHideColumn<TData>[];
  defaultSort?: SortingState;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean | ((row: TData) => boolean); // Allow function for conditional selection
  enableHiding?: boolean;
  meta?: TableMeta<TData>;
}

const schema = z.object({
  page: z.coerce.number().default(1).optional(),
  per_page: z.coerce.number().default(10).optional(),
  sort: z.string().optional(),
});

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  searchableColumns = [],
  filterableColumns = [],
  initialHideColumns = [],
  defaultSort = [], // Default empty sort
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = false, // Default off
  enableHiding = true,
  meta,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse search params safely
  const safeParsedParams = schema.safeParse(Object.fromEntries(searchParams));

  const urlState = safeParsedParams.success ? safeParsedParams.data : {};

  const { page = 1, per_page = 10, sort } = urlState;

  const [column, order] = sort?.split(".") ?? [];

  // Memoize defaults
  const defaultSorting = React.useMemo(() => {
    if (column && order) return [{ id: column, desc: order === "desc" }];
    return defaultSort;
  }, [column, order, defaultSort]);

  const defaultPagination = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: per_page,
    }),
    [page, per_page]
  );

  // --- State Definitions ---
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() =>
      Object.fromEntries(
        initialHideColumns.map((item) => [item.id as string, !item.value])
      )
    );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      // Initial filters from URL
      const initialFilters: ColumnFiltersState = [];
      searchParams.forEach((value, key) => {
        const isSearchable = searchableColumns.some((sc) => sc.id === key);
        const isFilterable = filterableColumns.some((fc) => fc.id === key);
        if (isSearchable) {
          initialFilters.push({ id: key, value: value });
        } else if (isFilterable) {
          initialFilters.push({ id: key, value: value.split(".") });
        }
      });
      return initialFilters;
    }
  );

  const [pagination, setPagination] =
    React.useState<PaginationState>(defaultPagination);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);

  // Debounce search terms
  const debouncedSearchFilters = useDebounce(
    columnFilters.filter((f) => searchableColumns.some((sc) => sc.id === f.id)),
    300 // Adjust debounce time if needed
  );

  // Separate non-debounced filters (faceted)
  const facetedFilters = React.useMemo(
    () =>
      columnFilters.filter((f) =>
        filterableColumns.some((fc) => fc.id === f.id)
      ),
    [columnFilters, filterableColumns]
  );

  // --- URL Synchronization Effects ---

  // Sync pagination and sorting changes TO URL
  React.useEffect(() => {
    // Start with a copy of the current search params from the HOOK's perspective
    // This ensures we build upon the latest known state reflected in the URL initially
    const params = new URLSearchParams(searchParams.toString());

    // 1. Update Pagination and Sorting Parameters (No change in logic)
    params.set("page", (pagination.pageIndex + 1).toString());
    params.set("per_page", pagination.pageSize.toString());
    if (sorting[0]?.id) {
      params.set(
        "sort",
        `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`
      );
    } else {
      params.delete("sort");
    }

    // 2. Update Faceted Filter Parameters
    // Iterate through the columns configured as filterable
    filterableColumns.forEach((column) => {
      const key = column.id as string;
      // Find the current state for this specific filter
      const filterState = columnFilters.find((f) => f.id === key);

      if (
        filterState &&
        Array.isArray(filterState.value) &&
        filterState.value.length > 0
      ) {
        // If filter state exists and has selected values, set the param
        params.set(key, filterState.value.join("."));
        // console.log(`Setting Faceted Filter: ${key}=${filterState.value.join(".")}`); // Debug log
      } else {
        // If filter state doesn't exist or has an empty array, delete the param
        params.delete(key);
        // console.log(`Deleting Faceted Filter: ${key}`); // Debug log
      }
    });

    // 3. Update Debounced Search Filter Parameters
    // Iterate through the columns configured as searchable
    searchableColumns.forEach((column) => {
      const key = column.id as string;
      // Check the DEBOUNCED state for this search term
      const debouncedFilterState = debouncedSearchFilters.find(
        (f) => f.id === key
      );

      if (
        debouncedFilterState &&
        typeof debouncedFilterState.value === "string" &&
        debouncedFilterState.value
      ) {
        // If a debounced value exists and is not empty, set the param
        params.set(key, debouncedFilterState.value);
        // console.log(`Setting Search Filter: ${key}=${debouncedFilterState.value}`); // Debug log
      } else {
        // If no debounced value exists (or it's empty), delete the param
        params.delete(key);
        // console.log(`Deleting Search Filter: ${key}`); // Debug log
      }
    });

    // 4. Push URL if changed
    const newSearchString = params.toString();
    const currentSearchString = searchParams.toString();

    // console.log("Current Search Params:", currentSearchString); // Debug log
    // console.log("New Search Params String:", newSearchString); // Debug log

    if (newSearchString !== currentSearchString) {
      // console.log("Pushing new URL:", `${pathname}?${newSearchString}`); // Debug log
      router.push(`${pathname}?${newSearchString}`, { scroll: false });
    }
    // else { // Debug log
    //   console.log("URL params unchanged, skipping push.");
    // }
  }, [
    // --- Dependencies ---
    pagination,
    sorting,
    // **Crucial:** Depend on columnFilters for IMMEDIATE faceted filter updates
    columnFilters,
    // **Crucial:** Depend on debouncedSearchFilters to APPLY search terms AFTER debounce
    debouncedSearchFilters,
    // These define which keys to look for and are stable unless props change
    filterableColumns,
    searchableColumns,
    // These are needed for navigation and comparison
    searchParams,
    pathname,
    router,
  ]);

  // --- React Table Instance ---
  const table = useReactTable<TData>({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination: enablePagination ? pagination : undefined,
      sorting: enableSorting ? sorting : undefined,
      columnVisibility: enableHiding ? columnVisibility : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      columnFilters,
    },
    // Column Visibility
    enableHiding,
    onColumnVisibilityChange: enableHiding ? setColumnVisibility : undefined,
    // Row Selection
    enableRowSelection: !!enableRowSelection, // Ensure boolean
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    getRowId: (row, index) => (row as any).id ?? `${index}`, // Assume row has 'id', fallback to index
    // Pagination
    manualPagination: enablePagination,
    onPaginationChange: enablePagination ? setPagination : undefined,
    // Sorting
    manualSorting: enableSorting,
    onSortingChange: enableSorting ? setSorting : undefined,
    // Filtering
    manualFiltering: enableFiltering,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    // Models
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(), // Keep if expansion is needed
    meta,
  });

  return { table };
}
