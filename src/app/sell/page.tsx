import { isLoggedIn } from "@/server/user";
import { SellPage } from "@/views/sell/components/sell-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "前台销售",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isLoggedIn())) {
    redirect("/login");
  }

  return <SellPage />;
}
