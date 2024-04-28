import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 pt-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <Skeleton className="w-64 h-10 rounded-sm" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
          <Skeleton className="h-[125px] md:w-[250px] lg:w-[395px] rounded-xl" />
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <Skeleton className="h-[320px] lg:w-[682px] md:w-[750px] rounded-xl" />
          <Skeleton className="h-[320px] lg:w-[507px] md:w-[750px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
