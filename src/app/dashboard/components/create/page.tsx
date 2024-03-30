import CreateComponentPage from "@/components/pages/repair_components/create-component-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "添加配件",
};

export default function Page() {
  return <CreateComponentPage />;
}
