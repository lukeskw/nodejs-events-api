import { FastifyInstance } from 'fastify'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { prisma } from '../../../lib/prisma'
import { createSlugFromTitle } from '../../../utils/slug'

export const createEvents = async (app: FastifyInstance) => {
  app.post('/events', async (request, reply) => {
    const createEventsBody = z.object({
      title: z.string().min(5),
      details: z.string().nullable(),
      maximumAttendees: z.number().int().positive().nullable(),
    })

    try {
      const { title, details, maximumAttendees } = createEventsBody.parse(
        request.body,
      )

      const slugTitle = createSlugFromTitle(title)

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug: slugTitle,
        },
      })

      return reply.status(201).send({ eventId: event.id })
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err)
        console.error('Error parsing request body:', validationError.message)
        return reply.status(400).send({ error: validationError.message })
      }
      console.error(err)
    }
  })
}
