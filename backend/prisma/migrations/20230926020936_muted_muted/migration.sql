/*
  Warnings:

  - You are about to drop the `UsermutedInChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsermutedInChat" DROP CONSTRAINT "UsermutedInChat_chatRoomId_fkey";

-- DropTable
DROP TABLE "UsermutedInChat";

-- CreateTable
CREATE TABLE "UserMutedInChat" (
    "chatRoomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "mutedUntil" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMutedInChat_pkey" PRIMARY KEY ("chatRoomId","userId")
);

-- AddForeignKey
ALTER TABLE "UserMutedInChat" ADD CONSTRAINT "UserMutedInChat_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
