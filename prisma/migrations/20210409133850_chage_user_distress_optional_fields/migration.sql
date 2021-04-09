/*
  Warnings:

  - The `emotionIntensity` column on the `DistressEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DistressEvent" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "emotion" DROP NOT NULL,
DROP COLUMN "emotionIntensity",
ADD COLUMN     "emotionIntensity" INTEGER,
ALTER COLUMN "factCheck" DROP NOT NULL,
ALTER COLUMN "skill" DROP NOT NULL,
ALTER COLUMN "opositeAction" DROP NOT NULL,
ALTER COLUMN "problemSolving" DROP NOT NULL;
