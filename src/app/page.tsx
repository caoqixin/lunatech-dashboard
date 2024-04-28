import HomePage from "@/components/pages/home/home-page";
import { auth } from "@/lib/user";
import { Metadata } from "next";

export default async function Home() {
  await auth();
  return <HomePage />;
}

export const metadata: Metadata = {
  title: "报价平台",
};
