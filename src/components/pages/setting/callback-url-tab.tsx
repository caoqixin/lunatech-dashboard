"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptionForm from "./option-form";

const CallbackUrlTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>回调地址</CardTitle>
        <CardDescription>分类所需的回调地址</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <OptionForm
          name="repair_category"
          label="配件回调地址"
          placeholder="配件分类"
        />
        <OptionForm
          name="repair_problem"
          label="维修故障回调地址"
          placeholder="维修故障"
        />
        <OptionForm
          name="display"
          label="屏幕回调地址"
          placeholder="屏幕分类"
        />
      </CardContent>
    </Card>
  );
};

export default CallbackUrlTab;
