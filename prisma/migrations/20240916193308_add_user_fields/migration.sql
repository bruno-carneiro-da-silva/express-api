/*
  Warnings:

  - A unique constraint covering the columns `[emailAdmin]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressCompany" TEXT,
ADD COLUMN     "emailAdmin" TEXT,
ADD COLUMN     "emailCompany" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nameCompany" TEXT,
ADD COLUMN     "phoneNumberAdmin" TEXT,
ADD COLUMN     "phoneNumberCompany" TEXT,
ADD COLUMN     "terms" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAdmin_key" ON "User"("emailAdmin");
