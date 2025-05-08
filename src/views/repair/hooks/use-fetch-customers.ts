import { Customer } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";

export const useFetchCustomers = (
  fetchFn: () => Promise<Customer[] | null>,
  shouldFetch: boolean = true
) => {
  const [data, setData] = useState<Customer[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await fetchFn();
      setData(result ? result : null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (!shouldFetch) return;

    loadData();
  }, [shouldFetch, loadData]);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return { data, isLoading, refetch };
};
