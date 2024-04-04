import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BadRequest } from '../../../exceptions/bad-request.exception'

export const checkIn = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:ticketId/check-in',
    {
      schema: {
        summary: 'Do CheckIn',
        tags: ['check-in'],
        params: z.object({
          ticketId: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { ticketId } = request.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          ticketId,
        },
      })

      if (attendeeCheckIn !== null) {
        throw new BadRequest('Attendee already checked in')
      }

      await prisma.checkIn.create({
        data: {
          ticketId,
        },
      })

      return reply.status(201).send()
    },
  )
}
