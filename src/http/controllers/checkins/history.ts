import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-checkins-history-use-case'

export const checkInsHistory = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  // Factory Pattern
  const fetchUserHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkIns })
}
