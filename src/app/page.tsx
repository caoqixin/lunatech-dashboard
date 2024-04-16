import HomePage from "@/components/pages/home/home-page";
import { auth } from "@/lib/user";

export default async function Home() {
  await auth();
  return <HomePage />;
}
