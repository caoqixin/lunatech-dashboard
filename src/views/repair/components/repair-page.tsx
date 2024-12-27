import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Header } from "@/components/custom/header";
import { Separator } from "@/components/ui/separator";
import { RepairSearch } from "@/views/repair/schema/repair.schema";
import { countRepairs, fetchRepairs } from "@/views/repair/api/repair";
import { RepairTable } from "@/views/repair/components/repair-table";
import { CreateRepair } from "@/views/repair/components/create-repair";

interface RepairPageProps {
  params: RepairSearch;
}

const breadcrumbItems: BreadCrumbType[] = [
  { title: "维修管理", link: "/dashboard/repairs" },
];

export const RepairPage = async ({ params }: RepairPageProps) => {
  const [data, count] = await Promise.all([
    fetchRepairs(params),
    countRepairs(params),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="维修管理">
        <CreateRepair />
      </Header>
      <Separator />
      <RepairTable data={data} count={count} />
    </div>
  );
};
