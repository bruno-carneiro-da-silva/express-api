-- DropForeignKey
ALTER TABLE "SoldItem" DROP CONSTRAINT "SoldItem_saleId_fkey";

-- AddForeignKey
ALTER TABLE "SoldItem" ADD CONSTRAINT "SoldItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
