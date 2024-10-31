/*
  Warnings:

  - You are about to drop the column `photo` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "photo",
ADD COLUMN     "photo_base64" TEXT;
