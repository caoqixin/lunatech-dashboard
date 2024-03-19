/*
  Warnings:

  - You are about to drop the `CategoryItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryItem" DROP CONSTRAINT "CategoryItem_categoryId_fkey";

-- DropTable
DROP TABLE "CategoryItem";

-- CreateTable
CREATE TABLE "category_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "category_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "site" TEXT,
    "username" TEXT,
    "password" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_items_name_key" ON "category_items"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");

-- AddForeignKey
ALTER TABLE "category_items" ADD CONSTRAINT "category_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
