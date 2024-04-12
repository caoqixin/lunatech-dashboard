-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "purchase_price" TEXT,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "public_price" DROP NOT NULL;
