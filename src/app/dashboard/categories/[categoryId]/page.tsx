import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import CategoryItemPage from "@/components/pages/category_items/category-items-page";
import { SearchParams } from "@/components/tables/v2/types";
import {
  generateCategoryIdParams,
  getCategoryById,
} from "@/lib/actions/server/categories";
import { auth } from "@/lib/user";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

export interface CategoryItemPageProps {
  searchParams: SearchParams;
  params: {
    categoryId: string;
  };
}

export default async function Page({
  params,
  searchParams,
}: CategoryItemPageProps) {
  await auth();
  const categoryId = parseInt(params.categoryId);
  const search = searchParamsSchema.parse(searchParams);

  return (
    <Suspense fallback={<DashboardDataSkeleton />}>
      <CategoryItemPage categoryId={categoryId} search={search} />
    </Suspense>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  const categories = await generateCategoryIdParams();

  return categories.map((category) => ({
    categoryId: category.id.toString(),
  }));
}

export async function generateMetadata(
  { params, searchParams }: CategoryItemPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { categoryId } = params;

  const category = await getCategoryById(parseInt(categoryId));

  if (category === null) {
    return {
      title: "分类管理",
    };
  }
  return {
    title: `分类 - ${category.name}`,
  };
}
