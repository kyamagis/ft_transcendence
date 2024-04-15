/*
  Warnings:

  - You are about to drop the column `secretKey` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "secretKey",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
