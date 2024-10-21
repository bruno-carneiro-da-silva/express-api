/*
  Warnings:

  - Added the required column `city` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endContractDate` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startContractDate` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "endContractDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "startContractDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
