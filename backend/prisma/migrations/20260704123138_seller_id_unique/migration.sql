/*
  Warnings:

  - A unique constraint covering the columns `[sellerId]` on the table `stores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stores_sellerId_key" ON "stores"("sellerId");
