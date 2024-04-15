-- AddForeignKey
ALTER TABLE "UserMutedInChat" ADD CONSTRAINT "UserMutedInChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBannedInChat" ADD CONSTRAINT "UserBannedInChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
