import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RepairTop from "./repair-top";
import { fetchTopRepair } from "@/lib/actions/data";

const XinCardTop = async () => {
  const top = await fetchTopRepair(10);

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>维修热榜 TOP 10</CardTitle>
        <CardDescription>热门维修手机型号</CardDescription>
      </CardHeader>
      <CardContent>
        <RepairTop data={top} />
      </CardContent>
    </Card>
  );
};

export default XinCardTop;
