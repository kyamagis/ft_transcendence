/*
  Warnings:

  - You are about to drop the column `subUserId` on the `UserRelation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,relatedUserId,relationType]` on the table `UserRelation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relatedUserId` to the `UserRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationType` to the `UserRelation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserRelation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FRIEND', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "UserRelation" DROP CONSTRAINT "UserRelation_subUserId_fkey";

-- AlterTable
ALTER TABLE "UserRelation" DROP COLUMN "subUserId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "relatedUserId" INTEGER NOT NULL,
ADD COLUMN     "relationType" "RelationType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserRelation_userId_relatedUserId_relationType_key" ON "UserRelation"("userId", "relatedUserId", "relationType");

-- AddForeignKey
ALTER TABLE "UserRelation" ADD CONSTRAINT "UserRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelation" ADD CONSTRAINT "UserRelation_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
