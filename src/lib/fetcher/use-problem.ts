import useSWR from "swr";
import { getProblems } from "../actions/server/get";
import { Option } from "@/components/ui/multi-select";

const fetcher = (name: string): Promise<Option[] | null> => getProblems(name);

export function useProblem(settingName: string) {
  const { data, error, isLoading } = useSWR(settingName, fetcher);

  if (error) return null;

  return {
    isLoading,
    data,
  };
}
