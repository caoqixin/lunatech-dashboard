import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CallbackUrlTab from "./callback-url-tab";
import AllBackupButton from "./db_backup/all_backup";

const breadcrumbItems: BreadCrumbType[] = [
  { title: "设置", link: "/dashboard/setting" },
];
const SettingPage = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="设置">{""}</XinHeader>
        <Separator />
        <ScrollArea className="h-full">
          <div className="flex-1">
            <Tabs defaultValue="callbackUrl" className="space-y-4">
              <TabsList>
                <TabsTrigger value="callbackUrl">回调地址</TabsTrigger>
                <TabsTrigger value="other">数据库备份 </TabsTrigger>
              </TabsList>
              <TabsContent value="callbackUrl" className="space-y-4">
                <CallbackUrlTab />
              </TabsContent>
              <TabsContent value="other" className="space-y-4">
                <div className="flex gap-4">
                  <AllBackupButton />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </>
    </div>
  );
};

export default SettingPage;
