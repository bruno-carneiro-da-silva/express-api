/*
  Warnings:

  - Added the required column `dateOfBirth` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niche` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "niche" TEXT NOT NULL;
