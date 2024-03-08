import EditComponentPage from "@/components/pages/repair_components/edit-component-page";

export default function Page({ params }: { params: { id: number } }) {
  const { id } = params;

  return <EditComponentPage id={id} />;
}
