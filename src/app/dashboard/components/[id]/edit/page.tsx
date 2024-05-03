import EditComponentPage from "@/components/pages/repair_components/edit-component-page";
import { getComponentById } from "@/lib/actions/server/repair_components";
import { auth } from "@/lib/user";
import { Metadata, ResolvingMetadata } from "next";

export default async function Page({ params }: { params: { id: string } }) {
  await auth();

  const { id } = params;

  return <EditComponentPage id={parseInt(id)} />;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = parseInt(params.id);

  const component = await getComponentById(id);

  if (component === null) {
    return {
      title: "配件管理",
    };
  }

  return {
    title: `修改${component.name}的名称`,
  };
}
