import DashboardDataSkeleton from "@/components/pages/_components/skeleton/dashboard-data-skeleton";
import CategoryItemPage from "@/components/pages/categories/category-items-page";
import { SearchParams } from "@/components/tables/v2/types";
import prisma from "@/lib/prisma";
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

export async function generateMetadata(
  { params, searchParams }: CategoryItemPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.categoryId;

  // fetch data
  const category = await prisma.category.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (category === null) {
    return {
      title: "分类管理",
    };
  }
  return {
    title: `${category.name} 的分类`,
  };
}
