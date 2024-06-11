import { PrismUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export const makeAuthenticateUseCase = () => {
  const prismaUserRepository = new PrismUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository)
  return authenticateUseCase
}
