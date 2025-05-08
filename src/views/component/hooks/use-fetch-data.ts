import type { Option } from "@/components/custom/multi-selector";
import { useState, useEffect, useCallback } from "react";

interface FetchDataResult {
  data: Option[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useFetchOptionData = (
  fetchFn: () => Promise<Option[]>,
  shouldFetch: boolean = true
): FetchDataResult => {
  const [data, setData] = useState<Option[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!shouldFetch) {
      // Reset if fetch condition becomes false
      setData(null); // Decide if you want to clear data when shouldFetch is false
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result ?? []); // Default to empty array if fetch returns null/undefined
    } catch (error) {
      console.error("Error fetching option data:", error);
      setError("无法加载选项数据");
      setData(null); // Set null on error
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetch, fetchFn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, isLoading, error };
};
