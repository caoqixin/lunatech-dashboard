import CreateComponentPage from "@/components/pages/repair_components/create-component-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "添加配件",
};

export default async function Page() {
  await auth();

  return <CreateComponentPage />;
}
