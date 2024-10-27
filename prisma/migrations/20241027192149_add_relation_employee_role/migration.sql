/*
  Warnings:

  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("uId") ON DELETE RESTRICT ON UPDATE CASCADE;
