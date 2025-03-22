-- AlterTable
ALTER TABLE "MarketerEarnings" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MERCHANT';
