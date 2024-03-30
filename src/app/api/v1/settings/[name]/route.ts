import prisma from "@/lib/prisma";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  noStore();
  const { name } = params;
  const setting = await prisma.setting.findUnique({
    where: {
      setting_name: name,
    },
  });

  return Response.json(setting);
}
