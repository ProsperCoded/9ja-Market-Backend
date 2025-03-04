/*
  Warnings:

  - The values [ELECTRONICS,FASHION,FOOD,HEALTH,HOME,SPORTS,TOYS] on the enum `ProductCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductCategory_new" AS ENUM ('EDUCATION_AND_STATIONERY', 'REAL_ESTATE_AND_HOUSING', 'EVENTS_AND_ENTERTAINMENT', 'TECHNOLOGY_SERVICES', 'CULTURAL_EXPERIENCES', 'FOOD_AND_GROCERIES', 'ELECTRONICS_AND_GADGETS', 'FASHION_AND_ACCESSORIES', 'HEALTH_AND_WELLNESS', 'HOME_AND_LIVING', 'AUTOMOBILE_NEEDS', 'TRADITIONAL_CRAFTS', 'SPORTS_AND_OUTDOOR', 'KIDS_AND_BABY_PRODUCTS');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "ProductCategory_new" USING ("category"::text::"ProductCategory_new");
ALTER TYPE "ProductCategory" RENAME TO "ProductCategory_old";
ALTER TYPE "ProductCategory_new" RENAME TO "ProductCategory";
DROP TYPE "ProductCategory_old";
COMMIT;
