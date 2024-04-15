-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "needTwoFA" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFASetting" BOOLEAN NOT NULL DEFAULT false;
