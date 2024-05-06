import useSWR from "swr";
import { getSuppliers } from "../actions/server/get";

const fetcher = (flag: any) => getSuppliers();

export default function useSupplier() {
  const { data } = useSWR("11", fetcher);

  return {
    suppliers: data,
  };
}
