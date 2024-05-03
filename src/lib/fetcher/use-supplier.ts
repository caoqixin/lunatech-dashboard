import useSWR from "swr";
import { getSuppliers } from "../actions/server/get";

const fetcher = () => getSuppliers();

export default function useSupplier() {
  const { data } = useSWR({}, fetcher);

  return {
    suppliers: data,
  };
}
