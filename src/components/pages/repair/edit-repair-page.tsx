import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ResetIcon } from "@radix-ui/react-icons";
import { EditRepairForm } from "./edit-repair-form";

const EditRepairPage = async ({ id }: { id: number }) => {
  const res = await fetch(`http://localhost:3000/api/v1/repairs/${id}/edit`);

  const repair = await res.json();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "维修管理", link: "/dashboard/repairs" },
    {
      title: `修改 ${repair.phone} 维修`,
      link: `/dashboard/repairs/${repair.id}/edit`,
    },
  ];
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={`修改 ${repair.phone} 维修`}>
          <Button className="text-xs md:text-sm" variant="outline" asChild>
            <Link href="/dashboard/repairs">
              <ResetIcon className="mr-2 h-4 w-4" /> 返回
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        <EditRepairForm initialData={repair} />
      </>
    </div>
  );
};

export default EditRepairPage;
