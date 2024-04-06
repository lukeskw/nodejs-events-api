import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const getEventAttendees = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Get the attendees for an event',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number),
          itemsPerPage: z
            .enum(['10', '20', '50'])
            .nullish()
            .default('10')
            .transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                ticketId: z.string(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              }),
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, query, itemsPerPage } = request.query

      const [attendees, total] = await prisma.$transaction([
        prisma.attendee.findMany({
          select: {
            id: true,
            ticketId: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              }
            : {
                eventId,
              },
          take: itemsPerPage,
          skip: pageIndex * itemsPerPage,
          orderBy: {
            createdAt: 'asc',
          },
        }),
        prisma.attendee.count({
          where: query
            ? {
                eventId,
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              }
            : {
                eventId,
              },
        }),
      ])

      await new Promise((resolve) => setTimeout(resolve, 500))

      return reply.status(200).send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            ticketId: attendee.ticketId,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkedInAt: attendee.checkIn?.createdAt ?? null,
          }
        }),
        total,
      })
    },
  )
}
