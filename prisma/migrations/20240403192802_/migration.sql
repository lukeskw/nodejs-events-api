/*
  Warnings:

  - You are about to drop the column `attendee_id` on the `check_ins` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticket_id]` on the table `check_ins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticket_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_attendee_id_fkey";

-- DropIndex
DROP INDEX "check_ins_attendee_id_key";

-- AlterTable
ALTER TABLE "check_ins" DROP COLUMN "attendee_id",
ADD COLUMN     "ticket_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_ticket_id_key" ON "check_ins"("ticket_id");

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "attendees"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;
