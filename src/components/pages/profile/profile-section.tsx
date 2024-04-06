import { Separator } from "@/components/ui/separator";

interface ProfileSectionProps {
  label: string;
  children: React.ReactNode;
}

export default function ProfileSection({
  label,
  children,
}: ProfileSectionProps) {
  return (
    <div className="-m-2 border p-2 rounded-md">
      <h4 className="text-sm font-medium leading-none flex justify-start">
        {label}
      </h4>
      <Separator className="my-4" />
      <div className="grid rid-cols-1 text-left">{children}</div>
    </div>
  );
}
