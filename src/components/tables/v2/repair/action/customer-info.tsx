"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/lib/fetcher/use-customer";

export default function CustomerInfo({ customerId }: { customerId: number }) {
  const { customer, isLoading } = useCustomer(customerId);
  if (isLoading) return <Skeleton className="h-6 w-28" />;

  return <span>{customer?.tel}</span>;
}
