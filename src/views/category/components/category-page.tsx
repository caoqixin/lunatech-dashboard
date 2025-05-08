"use client";

import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { CategorySearchParams } from "@/views/category/schema/category.schema";
import { CreateCategory } from "./create-category";
import { SwitchCategory } from "./switch-category";
import { useRouter } from "next/navigation";
import type { CategoryComponent } from "@/lib/types";

interface CategoryPageProps {
  search: CategorySearchParams;
  initialData: CategoryComponent[]; // Receive initial data
  initialCount: number; // Receive initial count
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "分类管理", link: "/dashboard/categories" },
];

export const CategoryPage = ({
  search,
  initialData,
  initialCount,
}: CategoryPageProps) => {
  const router = useRouter();
  const { type } = search;

  // Callback for successful creation/edit/deletion
  const handleSuccess = () => {
    router.refresh(); // Centralized refresh logic
  };

  return (
    // Removed p-4/p-8 here, assuming parent layout provides padding
    <div className="flex-1 space-y-4 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="分类管理">
        {/* Pass type and onSuccess callback */}
        <CreateCategory type={type} onSuccess={handleSuccess} />
      </Header>
      <Separator />
      {/* Pass initial data and count */}
      <SwitchCategory type={type} data={initialData} count={initialCount} />
    </div>
  );
};
