import { Customer } from "@prisma/client";
import useSWR from "swr";

const fetcher = (url: string): Promise<Customer> =>
  fetch(url).then((res) => res.json());

export function useCustomer(id: number) {
  const { data, error, isLoading } = useSWR(`/api/v1/customers/${id}`, fetcher);

  return {
    customer: data,
    isLoading,
    isError: error,
  };
}
