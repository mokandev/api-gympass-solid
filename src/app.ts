import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import { globalErrorHandler } from './http/middlewares/errorHandler'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { env } from './env'
import { gymRoutes } from './http/controllers/gyms/routes'
import { checkInsRoute } from './http/controllers/checkins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInsRoute)

app.setErrorHandler(globalErrorHandler)
