import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export const createGym = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(request.body)

  // Factory Pattern
  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.createGym({
    title,
    description,
    latitude,
    longitude,
    phone,
  })

  return reply.status(201).send()
}
