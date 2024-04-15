/*
  Warnings:

  - The values [BLOCKED] on the enum `RelationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationType_new" AS ENUM ('FRIEND', 'BLOCKING');
ALTER TABLE "UserRelation" ALTER COLUMN "relationType" TYPE "RelationType_new" USING ("relationType"::text::"RelationType_new");
ALTER TYPE "RelationType" RENAME TO "RelationType_old";
ALTER TYPE "RelationType_new" RENAME TO "RelationType";
DROP TYPE "RelationType_old";
COMMIT;
