import { env } from '@/env'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export const globalErrorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  } else {
    if (env.NODE_ENV !== 'production') {
      console.error(error)
    } else {
      // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
    }
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
