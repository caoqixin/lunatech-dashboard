"use client";

import { CategoryType } from "@/views/category/schema/category.schema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryComponentTable } from "./category-component-table";
import { RepairProblemTable } from "./repair-problem-table";
import type { CategoryComponent, RepairProblem } from "@/lib/types";

interface SwitchCategoryProps {
  type: CategoryType;
  data: CategoryComponent[] | RepairProblem[];
  count: number;
}

export const SwitchCategory = ({ type, data, count }: SwitchCategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", newType);
    // Reset page number when switching tabs? Optional but good UX.
    params.set("page", "1");
    router.replace(`/dashboard/categories?${params.toString()}`, {
      scroll: false,
    }); // Navigate with full path
  };

  return (
    <Tabs
      defaultValue={type}
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        {" "}
        {/* Grid layout for full width */}
        <TabsTrigger value={CategoryType.COMPONENT}>
          {" "}
          {/* Use enum value */}
          配件分类
        </TabsTrigger>
        <TabsTrigger value={CategoryType.REPAIR}>
          {" "}
          {/* Use enum value */}
          维修故障
        </TabsTrigger>
      </TabsList>
      {/* Render content based on the 'type' prop passed from parent */}
      {/* No need for TabsContent wrapper if tables handle their own display */}
      {type === CategoryType.COMPONENT ? (
        // Pass data cast to the correct type (ensure fetch logic aligns)
        <CategoryComponentTable
          data={data as CategoryComponent[]}
          count={count}
        />
      ) : (
        <RepairProblemTable data={data as RepairProblem[]} count={count} />
      )}
    </Tabs>
  );
};
