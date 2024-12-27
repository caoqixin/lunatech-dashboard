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

  const search = repairSearchSchema.parse(searchParams);

  return <RepairPage params={search} />;
}
