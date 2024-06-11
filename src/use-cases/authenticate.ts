import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/interfaces/users-repository'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

interface IAuthenticateUseCase {
  execute(
    params: AuthenticateUseCaseRequest,
  ): Promise<AuthenticateUseCaseResponse>
}
export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
