-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "setting_name" TEXT NOT NULL,
    "setting_value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
