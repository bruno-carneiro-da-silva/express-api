/*
  Warnings:

  - You are about to drop the column `url` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `base64` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "url",
ADD COLUMN     "base64" TEXT NOT NULL;
