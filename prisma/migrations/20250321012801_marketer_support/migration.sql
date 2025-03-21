/*
  Warnings:

  - You are about to drop the column `credentialsUrl` on the `Marketer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Marketer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `IdentityCredentialImage` to the `Marketer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IdentityCredentialType` to the `Marketer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Marketer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MARKETER';

-- AlterTable
ALTER TABLE "Marketer" DROP COLUMN "credentialsUrl",
ADD COLUMN     "IdentityCredentialImage" TEXT NOT NULL,
ADD COLUMN     "IdentityCredentialType" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "referrerCode" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MarketerEarnings" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "marketerId" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "AdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketerEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketerEarnings_AdId_key" ON "MarketerEarnings"("AdId");

-- CreateIndex
CREATE INDEX "MarketerEarnings_marketerId_idx" ON "MarketerEarnings"("marketerId");

-- CreateIndex
CREATE INDEX "MarketerEarnings_merchantId_idx" ON "MarketerEarnings"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Marketer_username_key" ON "Marketer"("username");

-- AddForeignKey
ALTER TABLE "MarketerEarnings" ADD CONSTRAINT "MarketerEarnings_marketerId_fkey" FOREIGN KEY ("marketerId") REFERENCES "Marketer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerEarnings" ADD CONSTRAINT "MarketerEarnings_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketerEarnings" ADD CONSTRAINT "MarketerEarnings_AdId_fkey" FOREIGN KEY ("AdId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
