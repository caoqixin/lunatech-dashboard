import { useEffect, useState, useCallback } from "react";
import { fetchPhonesByBrandForCreateComponent } from "@/views/phones/api/phone";
import type { Option } from "@/components/custom/multi-selector";

// Define return type
interface FetchPhonesResult {
  phones: Option[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useFetchPhonesByBrand = (
  brand: string | null | undefined
): FetchPhonesResult => {
  const [phones, setPhones] = useState<Option[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhones = useCallback(async (brandToFetch: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPhonesByBrandForCreateComponent(brandToFetch);
      // Ensure map only runs on actual array data
      setPhones(
        (data ?? []).map((item) => ({
          // Assuming your Option type needs value and label
          id: item.id,
          name: item.name,
        }))
      );
    } catch (err) {
      console.error(`Failed to fetch phones for brand ${brandToFetch}:`, err);
      setError("无法加载手机型号");
      setPhones(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (brand) {
      fetchPhones(brand);
    } else {
      // Clear phones and error if brand is cleared
      setPhones(null);
      setError(null);
      setIsLoading(false);
    }
  }, [brand, fetchPhones]);

  return { phones, isLoading, error };
};
