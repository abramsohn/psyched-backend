/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetToken` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resetTokenExpiry` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'THERAPIST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "resetToken" TEXT NOT NULL,
ADD COLUMN     "resetTokenExpiry" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'CLIENT',
ALTER COLUMN "name" SET NOT NULL;
