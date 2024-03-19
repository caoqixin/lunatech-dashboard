-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phones" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isTablet" BOOLEAN NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "phones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "phones_name_key" ON "phones"("name");

-- CreateIndex
CREATE UNIQUE INDEX "phones_code_key" ON "phones"("code");

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
