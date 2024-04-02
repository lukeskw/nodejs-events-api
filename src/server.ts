import fastify from 'fastify'
import { registerEventsRoutes } from './events.routes'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

registerEventsRoutes(app)

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`server listening on ${address}`)
  console.log(`server listening on ${address}`)
})
