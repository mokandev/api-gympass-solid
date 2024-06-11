import { FastifyInstance } from 'fastify'
import { createUser } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', createUser)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
