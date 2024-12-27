import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";

import { Separator } from "@/components/ui/separator";
import { SearchComponent } from "@/views/component/schema/component.schema";
import {
  countComponents,
  fetchComponents,
} from "@/views/component/api/component";
import { ComponentTable } from "@/views/component/components/component-table";
import { fetchComponentCategoryFilterOptions } from "@/views/category/api/component";
import { fetchComponentBrandsFilterOptions } from "@/views/brand/api/brand";
import {
  DataTableFilterableColumn,
  Option,
} from "@/components/data-table/type";
import { Component } from "@/lib/types";
import { CreateComponent } from "@/views/component/components/create-component";

interface ComponentPageProps {
  search: SearchComponent;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "配件管理", link: "/dashboard/components" },
];

async function fetchComponentCategories(): Promise<Option[]> {
  const data = await fetchComponentCategoryFilterOptions();

  return data.map((item) => ({
    label: item.name ?? "",
    value: item.name ?? "",
  }));
}

async function fetchComponentBrands(): Promise<Option[]> {
  const data = await fetchComponentBrandsFilterOptions();

  return data.map((item) => ({
    label: item.name ?? "",
    value: item.name ?? "",
  }));
}

export const ComponentPage = async ({ search }: ComponentPageProps) => {
  const [data, count, categoryOptions, brandOptions] = await Promise.all([
    fetchComponents(search),
    countComponents(search),
    fetchComponentCategories(),
    fetchComponentBrands(),
  ]);

  const filterableColumns: DataTableFilterableColumn<Component>[] = [
    {
      id: "category",
      title: "分类",
      options: categoryOptions,
    },
    {
      id: "brand",
      title: "品牌",
      options: brandOptions,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="配件管理">
        <CreateComponent />
      </Header>
      <Separator />
      <ComponentTable
        data={data}
        count={count}
        filterColumn={filterableColumns}
      />
    </div>
  );
};
