import useSWR from "swr";
import { getBrands } from "../actions/server/get";

const fetcher = (flag: any) => getBrands();

export default function useBrand() {
  const { data } = useSWR("12", fetcher);

  return {
    brands: data,
  };
}
