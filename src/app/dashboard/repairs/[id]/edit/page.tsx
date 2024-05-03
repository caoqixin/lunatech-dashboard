import EditRepairPage from "@/components/pages/repair/edit-repair-page";
import { getRepairById } from "@/lib/actions/server/repairs";
import { auth } from "@/lib/user";
import { Metadata, ResolvingMetadata } from "next";

export default async function Page({ params }: { params: { id: string } }) {
  await auth();
  const id = parseInt(params.id);

  return <EditRepairPage id={id} />;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = parseInt(params.id);

  // fetch data
  const repair = await getRepairById(id);

  if (repair === null) {
    return {
      title: "维修管理",
    };
  }
  return {
    title: `修改${repair.phone} 资料`,
  };
}
