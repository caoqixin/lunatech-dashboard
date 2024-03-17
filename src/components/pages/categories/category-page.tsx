import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import CreateCategory from "./create-category";
import { categoryColumns } from "@/components/tables/columns/category-columns";
import { unstable_noStore } from "next/cache";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

const CategoryPage = async () => {
  unstable_noStore();
  const res = await fetch("http://localhost:3000/api/v1/categories");

  const data = await res.json();

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
