import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAllTopRepair, fetchTopRepair } from "@/views/dashboard/api/data";
import { ShowMoreList } from "@/views/dashboard/components/show-more-list";

export const TopList = async () => {
  const phones = await fetchTopRepair();
  const data = await fetchAllTopRepair();
  return (
    <Card>
      <CardHeader>
        <CardTitle>维修热榜 TOP 5</CardTitle>
        <CardDescription>热门维修手机型号</CardDescription>
      </CardHeader>
      <CardContent>
        {phones.length > 0 ? (
          <div className="flex flex-col space-y-4">
            <div className="space-y-4">
              {phones.map((phone, index) => (
                <div className="flex items-center" key={index}>
                  <span>{index + 1}.</span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {phone.name.trim()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{phone.count} 次</div>
                </div>
              ))}
            </div>
            <ShowMoreList data={data} />
          </div>
        ) : (
          <div className="flex items-center justify-center">暂时还没有数据</div>
        )}
      </CardContent>
    </Card>
  );
};
