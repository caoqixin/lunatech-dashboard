import XinInfoLabel from "@/components/pages/_components/xin-info-label";
import { toEUR, toString } from "@/lib/utils";
import { Component } from "@prisma/client";
import React from "react";

const ShowDetail = async ({ id }: { id: number }) => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/components/${id}`);

  const component: Component = await res.json();

  return (
    <div className="grid gap-4 py-4">
      <XinInfoLabel label="条形码" content={toString(component.code)} />
      <XinInfoLabel label="名称" content={toString(component.name)} />
      <XinInfoLabel label="通用名称" content={toString(component.alias)} />
      <XinInfoLabel label="分类" content={toString(component.category)} />
      <XinInfoLabel label="品质" content={toString(component.quality)} />
      <XinInfoLabel label="品牌" content={toString(component.brand)} />
      <XinInfoLabel label="适用型号" content={toString(component.category)} />
      <XinInfoLabel label="供应商" content={toString(component.supplier)} />
      <XinInfoLabel label="库存" content={toString(component.stock)} />
      <XinInfoLabel label="进价" content={toEUR(component.purchase_price)} />
      <XinInfoLabel label="报价" content={toEUR(component.public_price)} />
    </div>
  );
};

export default ShowDetail;
