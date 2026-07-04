-- CreateEnum
CREATE TYPE "CouponCategory" AS ENUM ('voucher', 'promo');

-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_storeId_fkey";

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "category" "CouponCategory" NOT NULL DEFAULT 'voucher',
ALTER COLUMN "storeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delivery_deadline" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
