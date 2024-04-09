import React, { Suspense } from "react";
import MoreButton from "@/components/pages/_components/more-button";
import { Loading } from "@/components/pages/_components/loading";
import { TopList } from "./top-list";

interface RepairTopProps {
  data: {
    title: string;
    count: number;
  }[];
}
const RepairTop = ({ data }: RepairTopProps) => {
  return (
    <div className="space-y-8">
      {data.length == 0 ? (
        <div className="flex items-center justify-center">暂时还没有数据</div>
      ) : (
        data.map((item, index) => (
          <div className="flex items-center" key={index}>
            <span>{index + 1}.</span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.title}</p>
            </div>
            <div className="ml-auto font-medium">{item.count} 次</div>
          </div>
        ))
      )}

      {data.length >= 10 && (
        <MoreButton title="热门维修手机型号排行" label="显示更多">
          <Suspense fallback={<Loading />}>
            <TopList />
          </Suspense>
        </MoreButton>
      )}
    </div>
  );
};

export default RepairTop;
