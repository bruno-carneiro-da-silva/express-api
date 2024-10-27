/*
  Warnings:

  - Made the column `companyId` on table `Sale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyId` on table `Supplier` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
