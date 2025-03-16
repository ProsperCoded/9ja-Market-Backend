-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'USER');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "referredById" TEXT;

-- CreateTable
CREATE TABLE "Marketer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "referrerCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountBank" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "credentialsUrl" TEXT NOT NULL,
    "BusinessType" TEXT NOT NULL,
    "marketingExperience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marketer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marketer_email_key" ON "Marketer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marketer_referrerCode_key" ON "Marketer"("referrerCode");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Marketer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
