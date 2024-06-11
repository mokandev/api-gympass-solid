import { PrismUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register'

export const makeRegisterUserCase = () => {
  const prismaUserRepository = new PrismUsersRepository()
  const registerUserCase = new RegisterUserCase(prismaUserRepository)

  return registerUserCase
}
