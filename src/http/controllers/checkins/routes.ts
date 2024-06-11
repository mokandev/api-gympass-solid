import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createCheckIn } from './create'
import { validateCheckIn } from './validate'
import { checkInsHistory } from './history'
import { checkInsMetrics } from './metrics'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const checkInsRoute = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', checkInsHistory)
  app.get('/check-ins/metrics', checkInsMetrics)
  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCheckIn,
  )
}
