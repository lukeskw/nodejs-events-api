import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { BadRequest } from '../../../exceptions/bad-request.exception'

export const getAttendeeBadge = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:ticketId/badge',
    {
      schema: {
        summary: 'Create a badge for Attendee',
        tags: ['attendees'],
        params: z.object({
          ticketId: z.string(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
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
        throw new BadRequest('Could not find attendee')
      }

      const baseURL = `${request.protocol}://${request.hostname}`

      const checkInURL = new URL(`/attendees/${ticketId}/check-in`, baseURL)

      return reply.status(200).send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString(),
        },
      })
    },
  )
}
