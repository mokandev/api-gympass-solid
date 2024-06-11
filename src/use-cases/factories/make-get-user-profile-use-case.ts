import { PrismUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export const makeGetUserProfileUseCase = () => {
  const prismaUserRepository = new PrismUsersRepository()
  const useCase = new GetUserProfileUseCase(prismaUserRepository)
  return useCase
}
