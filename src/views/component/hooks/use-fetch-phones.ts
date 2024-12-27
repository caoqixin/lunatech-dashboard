import { useEffect, useState } from "react";
import { fetchPhonesByBrandForCreateComponent } from "@/views/phones/api/phone";
import { Option } from "@/components/custom/multi-selector";

export const useFetchPhonesByBrand = (brand: string | null | undefined) => {
  const [phones, setPhones] = useState<Option[] | null>(null);

  useEffect(() => {
    async function fetchPhones(brand: string) {
      const data = await fetchPhonesByBrandForCreateComponent(brand);

      if (data.length > 0) {
        setPhones(
          data.map((item) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } else {
        setPhones(null);
      }
    }

    if (brand) {
      fetchPhones(brand);
    } else {
      setPhones(null);
    }
  }, [brand]);

  return phones;
};
