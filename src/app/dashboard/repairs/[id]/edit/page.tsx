import EditRepairPage from "@/components/pages/repair/edit-repair-page";
import { RepiarWithCustomer } from "@/lib/definitions";
import { auth } from "@/lib/user";
import { Metadata, ResolvingMetadata } from "next";

export default async function Page({ params }: { params: { id: number } }) {
  await auth();
  const id = params.id;

  return <EditRepairPage id={id} />;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const res = await fetch(`${process.env.BASE_URL}/api/v1/repairs/${id}/edit`);
  const repair: RepiarWithCustomer = await res.json();

  return {
    title: `修改${repair.phone} 资料`,
  };
}
