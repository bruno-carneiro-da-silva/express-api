/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumberAdmin]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumberAdmin_key" ON "User"("phoneNumberAdmin");
