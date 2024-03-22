import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ResetIcon } from "@radix-ui/react-icons";
import ComponentForm from "./component-form";
import { unstable_noStore } from "next/cache";

const EditComponentPage = async ({ id }: { id: number }) => {
  unstable_noStore();

  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/components/${id}/edit`
  );
  const component = await res.json();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "配件管理", link: "/dashboard/components" },
    {
      title: `修改 ${component.name}`,
      link: `/dashboard/components/${component.id}/edit`,
    },
  ];
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title={`修改 ${component.name}`}>
          <Button className="text-xs md:text-sm" variant="outline" asChild>
            <Link href="/dashboard/components">
              <ResetIcon className="mr-2 h-4 w-4" /> 返回
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        <ComponentForm initialData={component} />
      </>
    </div>
  );
};

export default EditComponentPage;
