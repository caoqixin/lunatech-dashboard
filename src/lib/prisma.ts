import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma.$extends({
  model: {
    brand: {
      async exists(name: string) {
        const result = await prisma.brand.findFirst({
          where: {
            name,
          },
        });

        return result !== null;
      },
    },
    phone: {
      async exists(name: string) {
        const result = await prisma.phone.findFirst({
          where: {
            name,
          },
        });

        return result !== null;
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
