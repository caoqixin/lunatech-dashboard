import { isLoggedIn } from "@/server/user";
import { CategoryPage } from "@/views/category/components/category-page";
import {
  CategorySearchParams,
  CategorySearchParamsSchema,
  CategoryType,
} from "@/views/category/schema/category.schema";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  fetchComponentCategories,
  countComponentCategory,
} from "@/views/category/api/component";
import { fetchProblems, countProblems } from "@/views/category/api/problem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { CategoryComponent, RepairProblem } from "@/lib/types";

export const metadata: Metadata = {
  title: "分类管理 | Luna Tech",
};

export interface CategoryPageProps {
  searchParams: CategorySearchParams;
}

type CategoryDisplayItem = { id: number; name: string };

async function fetchCategoryData(
  type: string,
  params: CategorySearchParams
): Promise<[CategoryDisplayItem[], number] | null> {
  // Return common type or null
  try {
    let data: CategoryComponent[] | RepairProblem[] = [];
    let count: number = 0;

    if (type === CategoryType.COMPONENT) {
      const [fetchedData, fetchedCount] = await Promise.all([
        fetchComponentCategories(params),
        countComponentCategory(params.per_page), // Assuming API matches this signature
      ]);
      data = fetchedData;
      count = fetchedCount;
    } else if (type === CategoryType.REPAIR) {
      const [fetchedData, fetchedCount] = await Promise.all([
        fetchProblems(params),
        countProblems(params.per_page),
      ]);
      data = fetchedData;
      count = fetchedCount;
    } else {
      // Handle unknown type - return empty data and 0 count
      return [[], 0];
    }
    // We can trust 'data' conforms to {id, name} here, or add explicit mapping if needed
    return [data as CategoryDisplayItem[], count];
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null; // Indicate error
  }
}

export const runtime = "edge";

export default async function Page({ searchParams }: CategoryPageProps) {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  const searchResult = CategorySearchParamsSchema.safeParse(searchParams);

  if (!searchResult.success) {
    // Instead of notFound, maybe redirect to default?
    // Or provide feedback? For now, keep notFound.
    console.error("Invalid search params:", searchResult.error);
    return notFound();
  }

  const searchData = searchResult.data;
  const categoryResult = await fetchCategoryData(searchData.type, searchData);

  // Handle potential fetch error
  if (categoryResult === null) {
    // Render an error message within the page layout structure
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* You might want a specific Error component here */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>无法加载分类数据，请稍后重试。</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Destructure data and count
  const [data, count] = categoryResult;

  // Pass everything needed to the client component
  return (
    <CategoryPage search={searchData} initialData={data} initialCount={count} />
  );
}
