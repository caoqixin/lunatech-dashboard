import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RepairTop from "./repair-top";

const XinCardTop = () => {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>维修热榜</CardTitle>
        <CardDescription>热门维修手机型号</CardDescription>
      </CardHeader>
      <CardContent>
        <RepairTop />
      </CardContent>
    </Card>
  );
};

export default XinCardTop;
