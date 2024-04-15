/*
  Warnings:

  - You are about to drop the column `ladderpoint` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('LadderMatch', 'InvitationalMatch');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ladderpoint",
ADD COLUMN     "ladderpoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MatchRecord" (
    "recordid" SERIAL NOT NULL,
    "matchtype" "MatchType" NOT NULL,
    "myid" INTEGER NOT NULL,
    "opponentid" INTEGER NOT NULL,
    "myscore" INTEGER NOT NULL,
    "opponentscore" INTEGER NOT NULL,
    "playedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchRecord_pkey" PRIMARY KEY ("recordid")
);

-- AddForeignKey
ALTER TABLE "MatchRecord" ADD CONSTRAINT "MatchRecord_myid_fkey" FOREIGN KEY ("myid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
