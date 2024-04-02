import { FastifyInstance } from 'fastify'
import { createEvents } from './http/routes/events/create-events.routes'
import { registerAttendeeForEvent } from './http/routes/events/register-attendee-for-event.routes'
import { getEvent } from './http/routes/events/get-event.routes'
import { getAttendeeBadge } from './http/routes/events/get-attendee-badge.routes'

export function registerEventsRoutes(app: FastifyInstance) {
  app.register(createEvents)
  app.register(registerAttendeeForEvent)
  app.register(getEvent)
  app.register(getAttendeeBadge)
}
