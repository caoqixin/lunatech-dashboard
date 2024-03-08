import { brands, phones } from "@/lib/placeholder-data";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name;
  const brand = brands.filter((brand) => brand.name == name)[0];

  const data = phones.filter((phone) => phone.brandId == brand.id);

  return Response.json({ data });
}
