import { Option } from "@/components/tables/v2/types";
import useSWR from "swr";
import { getCategoryForComponent } from "../actions/server/repair_components";
import { CategoryItem } from "@prisma/client";

const fetcher = (name: string): Promise<Option[] | null | CategoryItem[]> =>
  getCategoryForComponent(name, true);

export function useComponentCategory(category: string) {
  const { data, error, isLoading } = useSWR(category, fetcher);

  return {
    categories: data as CategoryItem[],
    isLoading,
    isError: error,
  };
}
