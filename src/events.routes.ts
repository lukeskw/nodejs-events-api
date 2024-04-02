import { FastifyInstance } from 'fastify'
import { createEvents } from './http/routes/events/create-events.routes'

export function registerEventsRoutes(app: FastifyInstance) {
  app.register(createEvents)
}
