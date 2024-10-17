/*
  Warnings:

  - Changed the type of `itineraries` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `descriptions` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "itineraries",
ADD COLUMN     "itineraries" JSONB NOT NULL,
DROP COLUMN "descriptions",
ADD COLUMN     "descriptions" JSONB NOT NULL;
