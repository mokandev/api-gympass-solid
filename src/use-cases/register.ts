import { hash } from 'bcryptjs'
import { User } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UsersRepository } from '@/repositories/interfaces/users-repository'

interface RegisterUserCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUserCaseResponse {
  user: User
}

interface IRegisterUserCase {
  createUser(params: RegisterUserCaseRequest): Promise<RegisterUserCaseResponse>
}

export class RegisterUserCase implements IRegisterUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async createUser({ email, password, name }: RegisterUserCaseRequest) {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })

    return { user }
  }
}
