import { Repair } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeOpenIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { DeleteRepair } from "./delete-repair";

const RepairCellAction = (repair: Repair) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/repairs/${repair.id}`}>
          <EyeOpenIcon className="w-4 h-4" /> 查看
        </Link>
      </Button>
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/repairs/${repair.id}/edit`}>
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Link>
      </Button>

      <DeleteRepair {...repair} />
    </div>
  );
};

export default RepairCellAction;
