import { prisma } from '../../src/lib/prisma'
async function seed() {
  await prisma.event.create({
    data: {
      id: '917c8f06-1342-48cc-83fc-1fb3f57d0c61',
      title: 'Event 1',
      slug: 'event-1',
      maximumAttendees: 120,
      details: 'Event details 1',
    },
  })
}

seed().then(() => {
  console.log('Seeded')
  prisma.$disconnect()
})
