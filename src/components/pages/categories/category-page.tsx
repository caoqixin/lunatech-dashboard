import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Category } from "@/lib/definitions";
import { categories } from "@/lib/placeholder-data";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import CreateCategory from "./create-category";
import { categoryColumns } from "@/components/tables/columns/category-columns";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

async function getData(): Promise<Category[]> {
  return categories;
}

const CategoryPage = async () => {
  const data = await getData();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="分类管理">
          <CreateCategory />
        </XinHeader>
        <Separator />
        <DataTable columns={categoryColumns} data={data} />
      </>
    </div>
  );
};

export default CategoryPage;
