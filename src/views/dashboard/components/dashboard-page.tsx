import { fetchRevenue } from "@/views/dashboard/api/data";
import { CardWrapper } from "@/views/dashboard/components/card-wrapper";
import { Revenue } from "@/views/dashboard/components/revenue";
import { TopList } from "@/views/dashboard/components/top-list";

const DashboardPage = async () => {
  const data = await fetchRevenue();
  return (
    <div className="p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight">首页</h2>
        </div>

        <div className="space-y-4">
          <CardWrapper />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 auto-cols-min">
            <Revenue data={data} />
            <TopList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
