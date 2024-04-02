/*
  Warnings:

  - A unique constraint covering the columns `[ticket_id]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ticket_id` on table `attendees` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "attendees" ALTER COLUMN "ticket_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attendees_ticket_id_key" ON "attendees"("ticket_id");
