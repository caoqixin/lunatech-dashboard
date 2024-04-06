import CreateRepairPage from "@/components/pages/repair/create-repair-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "创建维修项",
};
export default async function Page() {
  await auth();
  return <CreateRepairPage />;
}
