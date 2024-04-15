/*
  Warnings:

  - The primary key for the `UserRoleInChat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[chatRoomId,userId,userRole]` on the table `UserRoleInChat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "RoomType" ADD VALUE 'DM';

-- AlterTable
ALTER TABLE "UserRoleInChat" DROP CONSTRAINT "UserRoleInChat_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserRoleInChat_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleInChat_chatRoomId_userId_userRole_key" ON "UserRoleInChat"("chatRoomId", "userId", "userRole");

-- AddForeignKey
ALTER TABLE "UserRoleInChat" ADD CONSTRAINT "UserRoleInChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
