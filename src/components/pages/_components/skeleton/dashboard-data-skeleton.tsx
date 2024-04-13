import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function DashboardDataSkeleton({
  searchaBle = false,
}: {
  searchaBle?: boolean;
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Skeleton className="h-2 w-8" />
        <ChevronRightIcon className="h-4 w-4" />
        <Skeleton className="h-2 w-8" />
      </div>

      <>
        <div className="flex items-start justify-between">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="h-9 w-20 px-4 py-2 bg-slate-900 text-slate-50 shadow " />
        </div>
        <Separator />
        {searchaBle ? (
          <DataTableSkeleton
            columnCount={5}
            rowCount={8}
            searchableColumnCount={1}
            showViewOptions
          />
        ) : (
          <DataTableSkeleton columnCount={5} rowCount={8} showViewOptions />
        )}
      </>
    </div>
  );
}
