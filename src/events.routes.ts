import { FastifyInstance } from 'fastify'
import { createEvents } from './http/routes/events/create-events.routes'
import { registerAttendeeForEvent } from './http/routes/attendees/register-attendee-for-event.routes'
import { getEvent } from './http/routes/events/get-event.routes'
import { getAttendeeBadge } from './http/routes/attendees/get-attendee-badge.routes'
import { checkIn } from './http/routes/checkins/check-in'
import { getEventAttendees } from './http/routes/events/get-event-attendees.routes'
import { health } from './http/routes/health/health'

export function registerEventsRoutes(app: FastifyInstance) {
  app.register(createEvents)
  app.register(registerAttendeeForEvent)
  app.register(getEvent)
  app.register(getEventAttendees)
  app.register(getAttendeeBadge)
  app.register(checkIn)
  app.register(health)
}
