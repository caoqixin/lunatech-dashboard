/*
  Warnings:

  - A unique constraint covering the columns `[setting_name]` on the table `settings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "settings_setting_name_key" ON "settings"("setting_name");
