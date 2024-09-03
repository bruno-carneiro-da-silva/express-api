/*
  Warnings:

  - You are about to drop the column `productId` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
