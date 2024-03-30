import CategoryItemPage from "@/components/pages/categories/category-items-page";
import { SearchParams } from "@/components/tables/v2/types";
import prisma from "@/lib/prisma";
import { searchParamsSchema } from "@/schemas/search-params-schema";
import { Metadata, ResolvingMetadata } from "next";

export interface CategoryItemPageProps {
  searchParams: SearchParams;
  params: {
    categoryId: string;
  };
}

export default function Page({ params, searchParams }: CategoryItemPageProps) {
  const categoryId = parseInt(params.categoryId);
  const search = searchParamsSchema.parse(searchParams);

  return <CategoryItemPage categoryId={categoryId} search={search} />;
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
