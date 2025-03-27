import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
import { WarrantyPage } from "@/views/warranty/components/warranty-page";
import { searchWarrantyParamsSchema } from "@/views/warranty/schema/warranty.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "保修管理",
};
export interface WarrantyPageProps {
  searchParams: SearchParams;
}
export default async function Page({ searchParams }: WarrantyPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const search = searchWarrantyParamsSchema.parse(searchParams);

  return <WarrantyPage params={search} />;
}
