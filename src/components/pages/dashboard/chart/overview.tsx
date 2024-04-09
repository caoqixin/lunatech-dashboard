import React, { Suspense } from "react";
import { BarChart } from "./bar-chart";
import { fetchOverviewData } from "@/lib/actions/data";
import { Loading } from "../../_components/loading";

const Overview = async () => {
  const { countData, revenueData } = await fetchOverviewData();

  const labels = Object.keys(countData);
  const revenueValue = Object.values(revenueData);
  const countValue = Object.values(countData);
  return (
    <Suspense fallback={<Loading />}>
      <BarChart
        labels={labels}
        revenueValues={revenueValue}
        countValues={countValue}
      />
    </Suspense>
  );
};

export default Overview;
