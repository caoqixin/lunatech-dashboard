import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import {
  CategorySearchParams,
  CategoryType,
} from "@/views/category/schema/category.schema";
import {
  countComponentCategory,
  fetchComponentCategories,
} from "@/views/category/api/component";
import { countProblems, fetchProblems } from "@/views/category/api/problem";
import { CreateCategory } from "@/views/category/components/create-category";
import { SwitchCategory } from "@/views/category/components/switch-category";

interface CategoryPageProps {
  search: CategorySearchParams;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

async function fetchCategoryData(type: string, params: CategorySearchParams) {
  if (type === CategoryType.COMPONENT) {
    return await Promise.all([
      fetchComponentCategories(params),
      countComponentCategory(params.per_page),
    ]);
  } else if (type === CategoryType.REPAIR) {
    return await Promise.all([
      fetchProblems(params),
      countProblems(params.per_page),
    ]);
  }

  return [];
}

export const CategoryPage = async ({ search }: CategoryPageProps) => {
  const { type } = search;

  const categoryData = await fetchCategoryData(type, search);

  if (!categoryData) {
    return null;
  }

  const [data, count] = categoryData;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="分类管理">
        <CreateCategory type={type} />
      </Header>
      <Separator />
      <SwitchCategory type={type} data={data} count={count} />
    </div>
  );
};
