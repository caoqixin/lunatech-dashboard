import { Label } from "@/components/ui/label";

export default function XinInfoLabel({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4 border p-1">
      <Label className="text-right">{label}:</Label>
      <p className="col-span-3">{content ? content : "N/A"}</p>
    </div>
  );
}
