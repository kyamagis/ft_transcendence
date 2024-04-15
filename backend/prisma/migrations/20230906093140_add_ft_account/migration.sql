/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_username_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ALTER COLUMN "username" DROP NOT NULL;

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "FtAccount" (
    "id" SERIAL NOT NULL,
    "ftId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FtAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FtAccount_ftId_key" ON "FtAccount"("ftId");

-- CreateIndex
CREATE UNIQUE INDEX "FtAccount_ftId_userId_key" ON "FtAccount"("ftId", "userId");

-- AddForeignKey
ALTER TABLE "FtAccount" ADD CONSTRAINT "FtAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
