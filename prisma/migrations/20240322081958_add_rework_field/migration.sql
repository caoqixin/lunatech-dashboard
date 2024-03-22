-- AlterTable
ALTER TABLE "repairs" ADD COLUMN     "isRework" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "warranties" ADD COLUMN     "isRework" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reworkCount" INTEGER NOT NULL DEFAULT 0;
