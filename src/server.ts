import fastify from 'fastify'
import { registerEventsRoutes } from './events.routes'

const app = fastify()

registerEventsRoutes(app)

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`server listening on ${address}`)
  console.log(`server listening on ${address}`)
})
