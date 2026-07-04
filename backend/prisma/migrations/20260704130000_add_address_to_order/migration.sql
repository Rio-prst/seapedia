-- AlterTable: add addressId column (nullable first)
ALTER TABLE "orders" ADD COLUMN "addressId" INTEGER;

-- Backfill: assign the buyer's default address, or first address
UPDATE "orders"
SET "addressId" = (
  SELECT "id" FROM "addresses"
  WHERE "addresses"."buyerId" = "orders"."buyerId"
  ORDER BY "is_default" DESC, "created_at" ASC
  LIMIT 1
);

-- Cleanup: remove orders whose buyer has no address at all
DELETE FROM "orders" WHERE "addressId" IS NULL;

-- Now make the column required
ALTER TABLE "orders" ALTER COLUMN "addressId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey"
  FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
