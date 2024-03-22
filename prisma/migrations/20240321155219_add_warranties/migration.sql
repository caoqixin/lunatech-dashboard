-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "days" INTEGER NOT NULL,
    "repairId" INTEGER NOT NULL,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warranties_repairId_key" ON "warranties"("repairId");

-- AddForeignKey
ALTER TABLE "warranties" ADD CONSTRAINT "warranties_repairId_fkey" FOREIGN KEY ("repairId") REFERENCES "repairs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
