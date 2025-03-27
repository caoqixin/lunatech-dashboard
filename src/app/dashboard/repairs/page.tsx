import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
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
  let search;
  try {
    search = repairSearchSchema.parse(searchParams);
  } catch (error) {
    console.error("搜索参数解析错误:", error);
    // 使用默认参数
    search = repairSearchSchema.parse({});
  }

  return <RepairPage params={search} />;
}
