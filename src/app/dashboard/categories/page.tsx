import { isLoggedIn } from "@/server/user";
import { CategoryPage } from "@/views/category/components/category-page";
import {
  CategorySearchParams,
  CategorySearchParamsSchema,
} from "@/views/category/schema/category.schema";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// 指定为动态渲染
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "分类管理",
};

export interface CategoryPageProps {
  searchParams: CategorySearchParams;
}

export default async function Page({ searchParams }: CategoryPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const search = CategorySearchParamsSchema.safeParse(searchParams);

  if (!search.success) {
    return notFound();
  }

  return <CategoryPage search={search.data} />;
}
