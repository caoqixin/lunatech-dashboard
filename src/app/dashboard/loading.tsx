import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-3">
        <Skeleton className="w-11 h-4" />
        <div className="flex justify-between">
          <Skeleton className="w-8 h-5" />
          <Button asChild>
            <Skeleton />
          </Button>
        </div>
      </div>
      <DataTableSkeleton
        searchableColumnCount={1}
        columnCount={5}
        rowCount={3}
      />
    </div>
  );
}
