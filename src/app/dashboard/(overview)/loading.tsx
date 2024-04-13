import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="w-48 h-10" />
      </div>

      <div className="space-y-4">
        <div className="inline-flex h-9">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] lg:w-[250px] md:w-[440px] rounded-xl" />
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[526px] lg:w-[690px] md:w-[910px] rounded-xl" />
        <Skeleton className="h-[480px] lg:w-[510px] md:w-[910px] rounded-xl" />
      </div>
    </div>
  );
}
