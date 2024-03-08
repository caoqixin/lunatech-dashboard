import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = ["未维修", "维修中", "已维修", "已取件", "无法维修"];

const SelectStatus = ({ id, status }: { id: number; status: string }) => {
  const onChange = (value: string) => {
    console.log(value);
  };

  return (
    <Select defaultValue={status} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statuses.map((item) => (
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
