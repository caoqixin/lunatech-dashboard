"use client";
import { Button } from "@/components/ui/button";
import XinHeading from "./xin-heading";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

type XinHeaderProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  back?: string;
};

const XinHeader = ({ title, description, children, back }: XinHeaderProps) => {
  const router = useRouter();

  const goBack = () => {
    back && router.push(back);
  };
  return (
    <div className="flex items-start justify-between">
      <XinHeading title={title} description={description ? description : ""} />
      <div className="flex justify-between gap-2">
        {children}{" "}
        {back && (
          <Button
            className="text-xs md:text-sm"
            variant="secondary"
            onClick={goBack}
          >
            <ResetIcon className="mr-2 h-4 w-4" /> 返回
          </Button>
        )}
      </div>
    </div>
  );
};

export default XinHeader;
