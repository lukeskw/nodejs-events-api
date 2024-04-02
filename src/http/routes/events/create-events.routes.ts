import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { prisma } from '../../../lib/prisma'
import { createSlugFromTitle } from '../../../utils/slug'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const createEvents = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        body: z.object({
          title: z.string().min(5),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
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
        const { title, details, maximumAttendees } = request.body

        const slug = createSlugFromTitle(title)

        const eventWithSameSlug = await prisma.event.findUnique({
          where: { slug },
        })

        if (eventWithSameSlug !== null) {
          return reply.status(400).send({
            message: 'Event with this slug already exists',
          })
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
