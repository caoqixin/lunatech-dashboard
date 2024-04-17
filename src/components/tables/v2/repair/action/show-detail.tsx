import XinInfoLabel from "@/components/pages/_components/xin-info-label";
import { RepiarWithCustomer } from "@/lib/definitions";
import { toEUR, toString } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";

const ShowDetail = async ({ id }: { id: number }) => {
  const res = await fetch(`/api/v1/repairs/${id}`);
  const repair: RepiarWithCustomer = await res.json();

  return (
    <div className="grid gap-4 py-4">
      <h3 className="text-lg font-medium border-b-2">客人资料</h3>
      <XinInfoLabel label="客人名字" content={toString(repair.customer.name)} />
      <XinInfoLabel label="联系方式" content={toString(repair.customer.tel)} />
      <XinInfoLabel label="邮箱" content={toString(repair.customer.email)} />
      <h3 className="text-lg font-medium border-b-2">维修资料</h3>
      <XinInfoLabel label="手机型号" content={toString(repair.phone)} />
      <XinInfoLabel label="维修故障" content={toString(repair.problem)} />
      <XinInfoLabel label="维修状态" content={toString(repair.status)} />
      {!repair.isRework && (
        <>
          <XinInfoLabel label="订金" content={toEUR(repair.deposit)} />
          <XinInfoLabel label="价格" content={toEUR(repair.price)} />
        </>
      )}
      <XinInfoLabel
        label="创建时间"
        content={toString(dayjs(repair.createdAt).format("DD/MM/YYYY"))}
      />
    </div>
  );
};

export default ShowDetail;
