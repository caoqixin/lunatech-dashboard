import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Overview from "../dashboard/chart/overview";

const XinCardOverview = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>统计</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <Overview />
      </CardContent>
    </Card>
  );
};

export default XinCardOverview;
