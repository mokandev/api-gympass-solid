import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserHistoryUseCase } from '../fetch-user-checkins-history'

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserHistoryUseCase(checkInsRepository)

  return useCase
}
