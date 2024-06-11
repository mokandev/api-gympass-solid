import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { searchGyms } from './search'
import { fetchNearbyGyms } from './nearby'
import { createGym } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const gymRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', searchGyms)
  app.get('/gyms/nearby', fetchNearbyGyms)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
