import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const getEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              slug: z.string(),
              totalAttendees: z.number().int(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
          422: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { eventId } = request.params

        const event = await prisma.event.findUnique({
          select: {
            id: true,
            title: true,
            slug: true,
            details: true,
            maximumAttendees: true,
            _count: {
              select: {
                attendees: true,
              },
            },
          },
          where: {
            id: eventId,
          },
        })

        if (event === null) {
          return reply.status(400).send({
            message: 'Event not found',
          })
        }

        return reply.status(200).send({
          event: {
            id: event.id,
            title: event.title,
            slug: event.slug,
            details: event.details,
            maximumAttendees: event.maximumAttendees,
            totalAttendees: event._count.attendees,
          },
        })
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err)
          console.error('Error parsing request body:', validationError.message)
          return reply.status(422).send({ error: validationError.message })
        }
        console.error(err)
      }
    },
  )
}
