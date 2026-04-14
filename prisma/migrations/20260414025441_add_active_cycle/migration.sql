-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeCycleId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeCycleId_fkey" FOREIGN KEY ("activeCycleId") REFERENCES "CoopCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
