"use client";

import { CategoryType } from "@/views/category/schema/category.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryComponentTable } from "@/views/category/components/category-component-table";
import { RepairProblemTable } from "@/views/category/components/repair-problem-table";
import { CategoryComponent } from "@/lib/types";

interface SwitchCategoryProps {
  type: CategoryType;
  data: CategoryComponent[];
  count: number;
}

export const SwitchCategory = ({ type, data, count }: SwitchCategoryProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addQueryParam = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);

    router.replace(`?${params.toString()}`); // 仅更新查询参数
  };

  return (
    <Tabs defaultValue={type} className="w-full">
      <TabsList>
        <TabsTrigger
          value="components"
          onClick={() => addQueryParam("components")}
        >
          维修配件
        </TabsTrigger>
        <TabsTrigger value="repairs" onClick={() => addQueryParam("repairs")}>
          维修故障
        </TabsTrigger>
      </TabsList>
      <TabsContent value="components" className="flex flex-col space-x-2">
        <p className="text-2xl ml-4 font-bold flex justify-center">
          维修配件分类
        </p>
        <CategoryComponentTable data={data} count={count} />
      </TabsContent>
      <TabsContent value="repairs" className="flex flex-col space-x-2">
        <p className="text-2xl ml-4 font-bold flex justify-center">维修故障</p>
        <RepairProblemTable data={data} count={count} />
      </TabsContent>
    </Tabs>
  );
};
