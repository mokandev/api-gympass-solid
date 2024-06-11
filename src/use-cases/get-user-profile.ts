import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  id: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

interface IGetUserProfileUseCase {
  execute(
    params: GetUserProfileUseCaseRequest,
  ): Promise<GetUserProfileUseCaseResponse>
}
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: GetUserProfileUseCaseRequest) {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
