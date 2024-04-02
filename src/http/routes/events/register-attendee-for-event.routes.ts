import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { nanoid } from 'nanoid'

export const registerAttendeeForEvent = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/register',
    {
      schema: {
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
          return reply.status(400).send({
            message: 'Attendee with this email already exists',
          })
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
          return reply.status(400).send({
            message: 'Maximum number of attendees for this event was reached',
          })
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
