import { Customer } from "@/lib/types";
import { useState, useEffect } from "react";

export const useFetchCustomers = (
  fetchFn: () => Promise<Customer[] | null>,
  shouldFetch: boolean = true
) => {
  const [data, setData] = useState<Customer[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!shouldFetch) return;

    async function loadData() {
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
    }

    loadData();
  }, [shouldFetch, fetchFn]);

  return { data, isLoading };
};
