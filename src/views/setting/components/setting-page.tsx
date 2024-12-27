import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/custom/header";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "设置", link: "/dashboard/setting" },
];
const SettingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <Header title="设置">{""}</Header>
      <Separator />
      <ScrollArea className="h-full">
        <div className="flex-1">
          <Tabs defaultValue="system" className="space-y-4">
            <TabsList>
              <TabsTrigger value="system">系统设置</TabsTrigger>
              <TabsTrigger value="db">数据库</TabsTrigger>
            </TabsList>
            <TabsContent value="system" className="space-y-4">
              <div>系统设置</div>
            </TabsContent>
            <TabsContent value="db" className="space-y-4">
              <div>数据库设置</div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SettingPage;
