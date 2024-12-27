import { Option } from "@/components/custom/multi-selector";
import { useState, useEffect } from "react";

export const useFetchProblems = (
  fetchFn: () => Promise<Option[]>,
  shouldFetch: boolean = true
) => {
  const [data, setData] = useState<Option[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!shouldFetch) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result.length > 0 ? result : null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [shouldFetch, fetchFn]);

  return { data, isLoading };
};
