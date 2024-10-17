/*
  Warnings:

  - You are about to drop the column `endTime` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "endTime",
DROP COLUMN "startTime";
