import { SearchParams } from "@/components/data-table/type";
import { isLoggedIn } from "@/server/user";
import { ComponentPage } from "@/views/component/components/component-page";
import { searchComponentParamsSchema } from "@/views/component/schema/component.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// 指定为动态渲染
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "配件管理",
};

export interface ComponentPageProps {
  searchParams: SearchParams;
}

export default async function Page({ searchParams }: ComponentPageProps) {
  if (!isLoggedIn) {
    redirect("/login");
  }

  const params = searchComponentParamsSchema.parse(searchParams);

  return <ComponentPage search={params} />;
}
