import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchTopRepair } from "@/lib/actions/data";

export async function TopList() {
  const data = await fetchTopRepair();

  return (
    <ScrollArea className="h-[400px]">
      {data &&
        data.map((item, index) => (
          <div className="flex items-center" key={index}>
            <span>{index + 1}.</span>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.title}</p>
            </div>
            <div className="ml-auto font-medium">{item.count} 次</div>
          </div>
        ))}
    </ScrollArea>
  );
}
