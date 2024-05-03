"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ClientComponent,
  ClientRepiar,
  RepiarWithCustomer,
  ViewType,
} from "@/lib/definitions";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useState, useTransition } from "react";
import { Loading } from "@/components/pages/_components/loading";
import dynamic from "next/dynamic";

interface ViewItemProps {
  label: string;
  title: string;
  type: ViewType;
  loadData: () => Promise<
    ClientRepiar[] | RepiarWithCustomer | ClientComponent | null
  >;
}

const ShowRepairData = dynamic(
  () => import("@/components/tables/v2/customer/action/show-repairs"),
  {
    loading: () => <Loading />,
  }
);

const ShowDetail = dynamic(
  () => import("@/components/tables/v2/repair/action/show-detail"),
  {
    loading: () => <Loading />,
  }
);

const ShowComponent = dynamic(
  () => import("@/components/tables/v2/repair_component/action/show-detail"),
  {
    loading: () => <Loading />,
  }
);

export default function ViewItem({
  label,
  title,
  type,
  loadData,
}: ViewItemProps) {
  const [repairData, updateRepairData] = useState<ClientRepiar[]>([]);
  const [repairInfo, updateRepairInfo] = useState<RepiarWithCustomer | null>(
    null
  );
  const [componentInfo, updateComponentInfo] = useState<ClientComponent | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const fetchRepairData = async () => {
    const data: ClientRepiar[] | RepiarWithCustomer | ClientComponent | null =
      await loadData();

    startTransition(() => {
      if (type === "customers") {
        updateRepairData(data as ClientRepiar[]);
      }

      if (type === "repairs") {
        updateRepairInfo(data as RepiarWithCustomer | null);
      }

      if (type === "components") {
        updateComponentInfo(data as ClientComponent | null);
      }
    });
  };

  const render = (renderType: ViewType) => {
    if (renderType === "customers") {
      return isPending ? <Loading /> : <ShowRepairData data={repairData} />;
    }

    if (renderType === "repairs") {
      return isPending ? (
        <Loading />
      ) : repairInfo ? (
        <ShowDetail repair={repairInfo} />
      ) : (
        <Loading />
      );
    }

    if (renderType === "components") {
      return isPending ? (
        <Loading />
      ) : componentInfo ? (
        <ShowComponent component={componentInfo} />
      ) : (
        <Loading />
      );
    }

    return null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={fetchRepairData}
        >
          <EyeOpenIcon className="w-4 h-4" /> {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <>{render(type)}</>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              关闭
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
