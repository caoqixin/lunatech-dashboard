"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ResetIcon } from "@radix-ui/react-icons";

interface HeaderProps {
  title: string;
  description?: string;
  back?: string;
  children?: React.ReactNode;
}

export const Header = ({ title, description, back, children }: HeaderProps) => {
  const router = useRouter();

  const goBack = () => {
    back && router.push(back);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex justify-between gap-2">
        <div>{children}</div>
        {back && (
          <Button
            className="flex gap-2 items-center justify-center text-xs md:text-sm"
            variant="secondary"
            onClick={goBack}
          >
            <ResetIcon className="size-4" /> 返回
          </Button>
        )}
      </div>
    </div>
  );
};
