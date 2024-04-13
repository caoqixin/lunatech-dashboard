import React from "react";
import { BarChart } from "./bar-chart";
import { fetchOverviewData } from "@/lib/actions/data";
const Overview = async () => {
  const { countData, revenueData } = await fetchOverviewData();

  const labels = Object.keys(countData);
  const revenueValue = Object.values(revenueData);
  const countValue = Object.values(countData);
  return (
    <BarChart
      labels={labels}
      revenueValues={revenueValue}
      countValues={countValue}
    />
  );
};

export default Overview;
