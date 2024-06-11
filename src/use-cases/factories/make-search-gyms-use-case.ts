import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export const makeSearchGymsUseCase = () => {
  const GymsRepository = new PrismaGymRepository()
  const useCase = new SearchGymsUseCase(GymsRepository)

  return useCase
}
