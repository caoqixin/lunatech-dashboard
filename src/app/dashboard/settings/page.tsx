import { isLoggedIn } from "@/server/user";
import SettingPage from "@/views/setting/components/setting-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "设置",
};
export const runtime = "edge";

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <SettingPage />;
}
