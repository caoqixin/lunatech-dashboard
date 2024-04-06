import SettingPage from "@/components/pages/setting/setting-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "设置",
};

export default async function Page() {
  await auth();

  return <SettingPage />;
}
