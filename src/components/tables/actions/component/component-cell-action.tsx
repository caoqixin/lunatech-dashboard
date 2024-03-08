import { RepairComponent } from "@/lib/definitions";
import ViewInfo from "./view-info";
import { DeleteComponent } from "./delete-component";
import ShowDetail from "./show-detail";
import { Button } from "@/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

const ComponentCellAction = (component: RepairComponent) => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <ViewInfo name={component.name}>
        <ShowDetail id={component.id} />
      </ViewInfo>
      <Button variant="secondary" className="flex items-center gap-2" asChild>
        <Link href={`/dashboard/components/${component.id}/edit`}>
          <Pencil2Icon className="w-4 h-4" /> 修改
        </Link>
      </Button>
      <DeleteComponent {...component} />
    </div>
  );
};

export default ComponentCellAction;
