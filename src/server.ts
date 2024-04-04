import fastify from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import fastifyCors from '@fastify/cors'

import { registerEventsRoutes } from './events.routes'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description: 'API specs for the backend of the app pass.in',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

registerEventsRoutes(app)

app.setErrorHandler(errorHandler)
app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }

  app.log.info(`server listening on ${address}`)
  console.log(`server listening on ${address}`)
})
