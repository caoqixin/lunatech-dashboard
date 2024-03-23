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
import { useRouter } from "next/navigation";

const SelectStatus = ({
  id,
  status,
  isRework,
}: {
  id: number;
  status: string;
  isRework: boolean;
}) => {
  const statuses = ["未维修", "维修中", "已维修", "已取件", "无法维修"];
  const rework_statuses = ["返修中", "返修完成", "已取件"];
  const { toast } = useToast();
  const router = useRouter();

  const onChange = async (value: string) => {
    const res = await fetch(`/api/v1/repairs/status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: value, isRework: isRework }),
    });
    const data = await res.json();

    if (data.status == "success") {
      toast({
        title: data.msg,
      });
    } else {
      toast({
        title: data.msg,
        variant: "destructive",
      });
    }

    router.refresh();
  };

  return (
    <Select key={id} defaultValue={status} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="" />
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
};

export default SelectStatus;
