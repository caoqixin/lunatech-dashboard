import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export type BreadCrumbType = {
  title: string;
  link: string;
};

export type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

const BreadCrumb = ({ items }: BreadCrumbPropsType) => {
  return (
    <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        Dashboard
      </Link>
      {items.map((item: BreadCrumbType, index: number) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRightIcon className="h-4 w-4" />
          <Link
            href={item.link}
            className={cn(
              "font-medium",
              index === items.length - 1
                ? "text-foreground pointer-events-none"
                : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BreadCrumb;
