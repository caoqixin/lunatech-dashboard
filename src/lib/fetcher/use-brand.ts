import useSWR from "swr";
import { getBrands } from "../actions/server/get";

const fetcher = () => getBrands();

export default function useBrand() {
  const { data } = useSWR({}, fetcher);

  return {
    brands: data,
  };
}
