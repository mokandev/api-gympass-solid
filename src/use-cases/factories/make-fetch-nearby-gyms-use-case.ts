import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export const makeFetchNearbyGymsUseCase = () => {
  const GymsRepository = new PrismaGymRepository()
  const useCase = new FetchNearbyGymsUseCase(GymsRepository)

  return useCase
}
