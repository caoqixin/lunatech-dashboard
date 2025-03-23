import { isLoggedIn } from "@/server/user";
import { BrandPage } from "@/views/brand/components/brand-page";
import {
  BrandSearch,
  BrandSearchSchema,
} from "@/views/brand/schema/brand.schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// 指定为动态渲染
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "机型管理",
};

interface PageProps {
  searchParams: BrandSearch;
}

export default async function Page({ searchParams }: PageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const searchKey = BrandSearchSchema.parse(searchParams);

  return <BrandPage searchKey={searchKey} />;
}
