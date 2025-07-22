/*
  Warnings:

  - Made the column `comment` on table `Metric` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Metric` required. This step will fail if there are existing NULL values in that column.
  - Made the column `documentUrl` on table `Metric` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "expenses" DOUBLE PRECISION,
ADD COLUMN     "sales" DOUBLE PRECISION,
ALTER COLUMN "comment" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "documentUrl" SET NOT NULL;
