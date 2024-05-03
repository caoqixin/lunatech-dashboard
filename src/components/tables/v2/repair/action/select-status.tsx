"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { changeStatus } from "@/lib/actions/server/repairs";

const statuses = ["未维修", "维修中", "已维修", "已取件", "无法维修"];
const rework_statuses = ["返修中", "返修完成", "已取件"];

export default function SelectStatus({
  id,
  status,
  isRework,
}: {
  id: number;
  status: string;
  isRework: boolean;
}) {
  const { toast } = useToast();

  const onChange = async (value: string) => {
    const data = await changeStatus(id, value, isRework);

    if (data.status === "success") {
      toast({
        title: data.msg,
      });
    } else {
      toast({
        title: data.msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Select key={id} defaultValue={status} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="修改维修状态" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {isRework
            ? rework_statuses.map((item) => (
                <SelectItem key={item} value={item} defaultChecked>
                  {item}
                </SelectItem>
              ))
            : statuses.map((item) => (
                <SelectItem key={item} value={item} defaultChecked>
                  {item}
                </SelectItem>
              ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
