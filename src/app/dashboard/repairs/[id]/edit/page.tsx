import EditRepairPage from "@/components/pages/repair/edit-repair-page";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;

  return <EditRepairPage id={id} />;
}
