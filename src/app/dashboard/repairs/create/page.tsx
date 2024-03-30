import CreateRepairPage from "@/components/pages/repair/create-repair-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "创建维修项",
};
export default function Page() {
  return <CreateRepairPage />;
}
