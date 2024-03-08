import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { CategoryItem } from "@/lib/definitions";
import { categories, categoryItems } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import CreateCategoryItem from "./create-category-item";
import { categoryItemColumns } from "@/components/tables/columns/category-items-columns";

interface CategoryItemPageProps {
  categoryId: number;
}

async function getData(categoryId: number): Promise<CategoryItem[]> {
  return categoryItems.filter((items) => {
    return items.categoryId === categoryId;
  });
}

const CategoryItemPage = async ({ categoryId }: CategoryItemPageProps) => {
  // 获取当前所属分类
  const categoryTitle = categories.find((items) => {
    return items.id === categoryId;
  });

  if (categoryTitle === undefined) {
    return notFound();
  }

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "分类管理", link: "/dashboard/categories" },
    { title: categoryTitle.name, link: `/dashboard/categories/${categoryId}` },
  ];

  const data = await getData(categoryId);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={categoryTitle.name} back>
          <CreateCategoryItem />
        </XinHeader>
        <Separator />
        <DataTable columns={categoryItemColumns} data={data} />
      </>
    </div>
  );
};

export default CategoryItemPage;
