import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { DeleteRepair } from "./delete-repair";
import ViewInfo from "./view-info";
import { Suspense } from "react";
import ShowDetail from "./show-detail";
import { Repair } from "@prisma/client";
import { Loading } from "@/components/pages/_components/loading";

const RepairCellAction = (repair: Repair) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo name={repair.phone}>
        <Suspense fallback={<Loading />}>
          <ShowDetail id={repair.id} />
        </Suspense>
      </ViewInfo>
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/repairs/${repair.id}/edit`}>
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Link>
      </Button>

      {!repair.isRework && <DeleteRepair {...repair} />}
    </div>
  );
};

export default RepairCellAction;
