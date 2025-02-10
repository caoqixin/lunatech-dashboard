"use client";
import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { RepairSearch } from "@/views/repair/schema/repair.schema";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairTable } from "@/views/repair/components/repair-table";
import { CreateRepair } from "@/views/repair/components/create-repair";
import { useEffect, useState } from "react";
import { RepairWithCustomer } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface RepairPageProps {
  params: RepairSearch;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];

export const RepairPage = ({ params }: RepairPageProps) => {
  const [repairs, setRepairs] = useState<RepairWithCustomer[]>([]);
  const [count, setCount] = useState<number>(0);
  const supabase = createClient();
  useEffect(() => {
    //1, fetch init data
    async function loadInitialData() {
      const [data, count] = await Promise.all([
        fetchRepairs(params),
        countRepairs(params),
      ]);

      setRepairs(data);
      setCount(count);
    }

    loadInitialData();

    // 2. subscribe supabase realtime update
    const repairs = supabase
      .channel("repairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repairs" },
        () => {
          loadInitialData();
        }
      )
      .subscribe();

    // 3. unscribe when unmounted component
    return () => {
      supabase.removeChannel(repairs);
    };
  }, [params, supabase]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="维修管理">
        <CreateRepair />
      </Header>
      <Separator />
      <RepairTable data={repairs} count={count} />
    </div>
  );
};
