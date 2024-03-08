import ViewRepairPage from "@/components/pages/repair/view-repair-page";

export default function Page({ params }: { params: { id: number } }) {
  const id = params.id;

  return <ViewRepairPage id={id} />;
}
