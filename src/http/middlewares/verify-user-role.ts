import { FastifyReply, FastifyRequest } from 'fastify'

export const verifyUserRole = (roleVerify: 'ADMIN' | 'MEMBER') => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (role !== roleVerify) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
