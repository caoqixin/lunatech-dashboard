import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import CreateCategoryItem from "./create-category-item";
import prisma from "@/lib/prisma";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { CategoryItemTable } from "@/components/tables/v2/category_item/category-item-table";

interface CategoryItemPageProps {
  categoryId: number;
  search: searchParamsValue;
}

const CategoryItemPage = async ({
  categoryId,
  search,
}: CategoryItemPageProps) => {
  const stringSearch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSearch).toString();
  // 获取当前所属分类
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (category === null) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "分类管理", link: "/dashboard/categories" },
    { title: category.name, link: `/dashboard/categories/${categoryId}` },
  ];

  const res = await fetch(
    `http://localhost:3000/api/v1/categories/${categoryId}?${searchParams}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={category.name} back="/dashboard/categories">
          <CreateCategoryItem categoryId={categoryId} />
        </XinHeader>
        <Separator />
        <CategoryItemTable data={data} />
      </>
    </div>
  );
};

export default CategoryItemPage;
