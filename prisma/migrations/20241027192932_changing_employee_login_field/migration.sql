/*
  Warnings:

  - You are about to drop the column `login` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Employee_login_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "login",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userName_key" ON "Employee"("userName");
