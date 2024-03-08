import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "设置", link: "/dashboard/setting" },
];
const SettingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="设置">{""}</XinHeader>
        <Separator />
        <div>内容</div>
      </>
    </div>
  );
};

export default SettingPage;
