import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface XinCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const XinCard = ({ title, value, icon }: XinCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default XinCard;
