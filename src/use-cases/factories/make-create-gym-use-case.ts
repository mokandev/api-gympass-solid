import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export const makeCreateGymUseCase = () => {
  const GymsRepository = new PrismaGymRepository()
  const useCase = new CreateGymUseCase(GymsRepository)

  return useCase
}
