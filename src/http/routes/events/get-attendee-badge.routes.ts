import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const getAttendeeBadge = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:ticketId/badge',
    {
      schema: {
        params: z.object({
          ticketId: z.string(),
        }),
        response: {
          200: z.object({
            attendee: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().nullable(),
              ticketId: z.string(),
              event: z.object({
                title: z.string(),
              }),
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
        const { ticketId } = request.params

        const attendee = await prisma.attendee.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            ticketId: true,
            event: {
              select: {
                title: true,
              },
            },
          },
          where: {
            ticketId,
          },
        })

        if (attendee === null) {
          console.error('Could not find attendee')
          return reply.status(400).send({
            message: 'Attendee not found',
          })
        }

        return reply.status(200).send({
          attendee,
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
