/*
  Warnings:

  - The `merchantCategories` column on the `Merchant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "merchantCategories",
ADD COLUMN     "merchantCategories" "ProductCategory"[] DEFAULT ARRAY[]::"ProductCategory"[];

-- DropEnum
DROP TYPE "MerchantCategory";
