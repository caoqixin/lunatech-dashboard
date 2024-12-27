import XinCard from "@/components/custom/xin-card";
import {
  fetchAllComponentsPrice,
  fetchAllComponentsStock,
  fetchAnnualy,
  fetchAnnualyRepair,
  fetchMonthly,
  fetchMonthlyRepair,
} from "@/views/dashboard/api/data";
import { toEUR } from "@/lib/utils";

export const CardWrapper = async () => {
  const [
    annualy,
    monthly,
    annualyRepairs,
    monthlyRepairs,
    componentsStock,
    componentsTotalPrice,
  ] = await Promise.all([
    fetchAnnualy(),
    fetchMonthly(),
    fetchAnnualyRepair(),
    fetchMonthlyRepair(),
    fetchAllComponentsStock(),
    fetchAllComponentsPrice(),
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-cols-min gap-4">
      <XinCard title="年收入" value={toEUR(annualy)} />
      <XinCard title="月收入" value={toEUR(monthly)} />
      <XinCard title="年维修" value={annualyRepairs} />
      <XinCard title="月维修" value={monthlyRepairs} />
      <XinCard title="配件库存" value={componentsStock} />
      <XinCard title="配件价格" value={toEUR(componentsTotalPrice)} />
    </div>
  );
};
