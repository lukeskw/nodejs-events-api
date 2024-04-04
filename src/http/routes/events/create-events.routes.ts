import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { createSlugFromTitle } from '../../../utils/slug'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BadRequest } from '../../../exceptions/bad-request.exception'

export const createEvents = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        summary: 'Create an Event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(5),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      const slug = createSlugFromTitle(title)

      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug },
      })

      if (eventWithSameSlug !== null) {
        throw new BadRequest('Event with this slug already exists')
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      })

      return reply.status(201).send({ eventId: event.id })
    },
  )
}
