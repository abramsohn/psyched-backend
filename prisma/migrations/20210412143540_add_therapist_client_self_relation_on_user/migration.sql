-- AlterTable
ALTER TABLE "User" ADD COLUMN     "therapistId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
