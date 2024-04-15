/*
  Warnings:

  - You are about to drop the `LadderPoint` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ladderpoint` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LadderPoint" DROP CONSTRAINT "LadderPoint_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ladderpoint" INTEGER NOT NULL;

-- DropTable
DROP TABLE "LadderPoint";
