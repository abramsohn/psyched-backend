-- CreateTable
CREATE TABLE "DistressEvent" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "emotionIntensity" TEXT NOT NULL,
    "factCheck" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "opositeAction" TEXT NOT NULL,
    "problemSolving" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DistressEvent" ADD FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
