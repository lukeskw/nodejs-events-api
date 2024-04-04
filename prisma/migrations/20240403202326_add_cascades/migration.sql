-- DropForeignKey
ALTER TABLE "attendees" DROP CONSTRAINT "attendees_event_id_fkey";

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_ticket_id_fkey";

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "attendees"("ticket_id") ON DELETE CASCADE ON UPDATE CASCADE;
