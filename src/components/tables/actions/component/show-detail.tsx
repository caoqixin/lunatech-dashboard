import XinInfoLabel from "@/components/pages/_components/xin-info-label";
import { Label } from "@/components/ui/label";
import { RepairComponent } from "@/lib/definitions";
import { components } from "@/lib/placeholder-data";
import React from "react";

async function showComponent(id: number): Promise<RepairComponent> {
  setTimeout(() => console.log("loading data..."), 5000);
  return components.filter((value) => {
    return value.id == id;
  })[0];
}
const ShowDetail = async ({ id }: { id: number }) => {
  const component = await showComponent(id);

  return (
    <div className="grid gap-4 py-4">
      <XinInfoLabel label="条形码" content={component.code} />
      <XinInfoLabel label="名称" content={component.name} />
      <XinInfoLabel label="通用名称" content={component.alias} />
      <XinInfoLabel label="分类" content={component.category} />
      <XinInfoLabel label="品质" content={component.quality} />
      <XinInfoLabel label="品牌" content={component.brand} />
      <XinInfoLabel label="适用型号" content={component.category.toString()} />
      <XinInfoLabel label="供应商" content={component.supplier} />
      <XinInfoLabel label="库存" content={component.stock} />
      <XinInfoLabel label="进价" content={component.purchase_price} />
      <XinInfoLabel label="报价" content={component.public_price} />
    </div>
  );
};

export default ShowDetail;
