import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export const fetchNearbyGyms = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  // Factory Pattern
  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitute: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
