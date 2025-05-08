"use client";

import { Skeleton } from "@/components/ui/skeleton"; // Adjust path if needed
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path if needed
import { cn } from "@/lib/utils"; // Adjust path if needed

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  showViewOptions?: boolean;
  className?: string;
  // Added prop to control toolbar skeleton visibility
  showToolbar?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  searchableColumnCount = 0,
  filterableColumnCount = 0,
  showViewOptions = true,
  className,
  showToolbar = true, // Default to showing toolbar skeleton
}: DataTableSkeletonProps) {
  const safeColumnCount = Math.max(1, columnCount);
  const safeRowCount = Math.max(1, rowCount);
  const showToolbarSkeleton =
    showToolbar &&
    (searchableColumnCount > 0 || filterableColumnCount > 0 || showViewOptions);

  return (
    // Add pulse animation, ensure full width
    <div
      className={cn("w-full space-y-3 animate-pulse overflow-auto", className)}
    >
      {/* Toolbar Skeleton */}
      {showToolbarSkeleton && (
        <div className="flex w-full items-center justify-between gap-2 p-1">
          <div className="flex flex-1 items-center gap-2">
            {/* Search Skeletons */}
            {searchableColumnCount > 0 &&
              Array.from({ length: searchableColumnCount }).map((_, i) => (
                <Skeleton
                  key={`search-skel-${i}`}
                  className="h-9 w-full max-w-[200px] rounded-md bg-muted/80"
                />
              ))}
            {/* Filter Skeletons */}
            {filterableColumnCount > 0 &&
              Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton
                  key={`filter-skel-${i}`}
                  className="h-8 w-[80px] rounded-md bg-muted/80"
                />
              ))}
          </div>
          {/* View Options Skeleton */}
          {showViewOptions && (
            <Skeleton className="ml-auto hidden h-9 w-[80px] rounded-md lg:flex bg-muted/80" />
          )}
        </div>
      )}

      {/* Table Skeleton */}
      <div className="rounded-md border">
        {/* Add border */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b bg-muted/50">
              {/* Subtle header background */}
              {Array.from({ length: safeColumnCount }).map((_, i) => (
                <TableHead key={`head-skel-${i}`} className="h-11 px-3">
                  {/* Match header height/padding */}
                  <Skeleton className="h-5 w-full bg-muted" />{" "}
                  {/* Use different shade */}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: safeRowCount }).map((_, rowIndex) => (
              <TableRow
                key={`row-skel-${rowIndex}`}
                className="hover:bg-transparent border-b"
              >
                {Array.from({ length: safeColumnCount }).map((_, colIndex) => (
                  <TableCell
                    key={`cell-skel-${rowIndex}-${colIndex}`}
                    className="px-3 py-2.5"
                  >
                    <Skeleton className="h-5 w-full bg-muted/80" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-2 py-1 sm:gap-8">
        <Skeleton className="h-5 w-24 rounded bg-muted/80" />{" "}
        {/* Row count text */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
          <Skeleton className="h-8 w-36 rounded-md bg-muted/80" />{" "}
          {/* Page size select */}
          <Skeleton className="h-5 w-20 rounded bg-muted/80" />{" "}
          {/* Page info */}
          <Skeleton className="h-8 w-32 rounded-md bg-muted/80" />{" "}
          {/* Page buttons */}
        </div>
      </div>
    </div>
  );
}
