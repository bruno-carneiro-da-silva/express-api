/*
  Warnings:

  - Made the column `addressCompany` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailAdmin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emailCompany` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameCompany` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumberAdmin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumberCompany` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "addressCompany" SET NOT NULL,
ALTER COLUMN "emailAdmin" SET NOT NULL,
ALTER COLUMN "emailCompany" SET NOT NULL,
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "nameCompany" SET NOT NULL,
ALTER COLUMN "phoneNumberAdmin" SET NOT NULL,
ALTER COLUMN "phoneNumberCompany" SET NOT NULL;
