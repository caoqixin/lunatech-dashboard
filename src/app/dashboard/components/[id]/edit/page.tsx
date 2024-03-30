import EditComponentPage from "@/components/pages/repair_components/edit-component-page";
import { Metadata, ResolvingMetadata } from "next";

export default function Page({ params }: { params: { id: number } }) {
  const { id } = params;

  return <EditComponentPage id={id} />;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/components/${id}/edit`
  );
  const component = await res.json();

  return {
    title: `修改${component.name}的名称`,
  };
}
