/*
  Warnings:

  - You are about to drop the column `displayImage` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[displayImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "displayImage",
ADD COLUMN     "displayImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_displayImageId_key" ON "Product"("displayImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_displayImageId_fkey" FOREIGN KEY ("displayImageId") REFERENCES "ProductImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
