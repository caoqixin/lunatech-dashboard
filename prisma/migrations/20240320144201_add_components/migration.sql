-- CreateTable
CREATE TABLE "components" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "alias" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT[],
    "category" TEXT NOT NULL,
    "quality" TEXT NOT NULL DEFAULT 'compatibile',
    "supplier" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "purchase_price" DECIMAL(65,30) NOT NULL,
    "public_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "components_code_key" ON "components"("code");
