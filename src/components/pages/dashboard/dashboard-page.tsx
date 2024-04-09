import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import XinCardWrapper from "./xin-card-wrapper";
import XinCardOverview from "../_components/xin-card-overview";
import XinCardTop from "./xin-card-top";

export const revalidate = 0;

const DashboardPage = () => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">预览</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <XinCardWrapper />
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              {/* 统计图 */}
              <XinCardOverview />
              {/* 排行 */}
              <XinCardTop />
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            分析图
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default DashboardPage;
