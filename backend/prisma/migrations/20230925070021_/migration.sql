/*
  Warnings:

  - You are about to drop the `UserKickedInChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserKickedInChat" DROP CONSTRAINT "UserKickedInChat_chatRoomId_fkey";

-- DropTable
DROP TABLE "UserKickedInChat";

-- CreateTable
CREATE TABLE "UsermutedInChat" (
    "chatRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "mutedUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsermutedInChat_pkey" PRIMARY KEY ("chatRoomId","userId")
);

-- AddForeignKey
ALTER TABLE "UsermutedInChat" ADD CONSTRAINT "UsermutedInChat_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
