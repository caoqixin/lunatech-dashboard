import PhonePage from "@/components/pages/phone/phone-page";

export default function Page({ params }: { params: { brandId: string } }) {
  const brandId = parseInt(params.brandId);

  return <PhonePage brandId={brandId} />;
}
