import type { SearchParams } from "@/components/data-table/type";
import type { RepairWithCustomer } from "@/lib/types";
import { isLoggedIn } from "@/server/user";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairPage } from "@/views/repair/components/repair-page";
import { repairSearchSchema } from "@/views/repair/schema/repair.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "维修管理",
};

export interface RepairPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: RepairPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  // 添加错误处理，确保搜索参数解析正确
  const searchResult = repairSearchSchema.safeParse(searchParams);

  if (!searchResult.success) {
    redirect("/dashboard/repairs");
  }

  const searchData = searchResult.data;

  // 首次加载数据
  let initialData: RepairWithCustomer[] = [];
  let initialTotalPage = 0;
  let fetchError: string | null = null;

  try {
    [initialData, initialTotalPage] = await Promise.all([
      fetchRepairs(searchData),
      countRepairs(searchData),
    ]);
  } catch (error) {
    console.error(`Error fetching initial repairs:`, error);
    fetchError = "无法加载初始维修列表。";
  }

  return (
    <RepairPage
      searchParams={searchData}
      initialData={initialData ?? []}
      initialTotalPage={initialTotalPage ?? 0}
      fetchError={fetchError}
    />
  );
}
