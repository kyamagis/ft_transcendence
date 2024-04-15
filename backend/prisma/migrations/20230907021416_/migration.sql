/*
  Warnings:

  - Added the required column `roomType` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PRIVATE', 'PUBLIC', 'PASSWORD_PROTECTED');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "roomType" "RoomType" NOT NULL;
