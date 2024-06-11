import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export const searchGyms = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, q } = searchGymsQuerySchema.parse(request.query)

  // Factory Pattern
  const searchGymUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymUseCase.execute({ query: q, page })

  return reply.status(200).send({ gyms })
}
