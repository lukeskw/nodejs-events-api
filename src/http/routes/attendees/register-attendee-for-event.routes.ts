import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { nanoid } from 'nanoid'
import { BadRequest } from '../../../exceptions/bad-request.exception'

export const registerAttendeeForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/register',
    {
      schema: {
        summary: 'Register an attendee on Event',
        tags: ['attendees'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(5),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            ticketId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body
      const { eventId } = request.params

      const getAttendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          },
        },
      })

      if (getAttendeeFromEmail !== null) {
        throw new BadRequest('Attendee with this email already exists')
      }

      const [event, totalOfAttendeesOnEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),

        prisma.attendee.count({
          where: {
            eventId,
          },
        }),
      ])

      if (
        event?.maximumAttendees &&
        totalOfAttendeesOnEvent >= event?.maximumAttendees
      ) {
        throw new BadRequest(
          'Maximum number of attendees for this event was reached',
        )
      }

      const ticketId = nanoid(8)

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
          ticketId,
        },
      })

      return reply.status(201).send({ ticketId: attendee.ticketId })
    },
  )
}
