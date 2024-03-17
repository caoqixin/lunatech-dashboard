import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import CreateCategoryItem from "./create-category-item";
import { categoryItemColumns } from "@/components/tables/columns/category-items-columns";
import { unstable_noStore } from "next/cache";
import prisma from "@/lib/prisma";

interface CategoryItemPageProps {
  categoryId: number;
}

const CategoryItemPage = async ({ categoryId }: CategoryItemPageProps) => {
  unstable_noStore();
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
    `http://localhost:3000/api/v1/categories/${categoryId}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={category.name} back>
          <CreateCategoryItem categoryId={categoryId} />
        </XinHeader>
        <Separator />
        <DataTable columns={categoryItemColumns} data={data} />
      </>
    </div>
  );
};

export default CategoryItemPage;
