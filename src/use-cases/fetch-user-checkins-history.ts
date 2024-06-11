import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'

interface FetchUserHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

interface IFetchUserHistoryUseCase {
  execute(
    params: FetchUserHistoryUseCaseRequest,
  ): Promise<FetchUserHistoryUseCaseResponse>
}
export class FetchUserHistoryUseCase implements IFetchUserHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserHistoryUseCaseRequest): Promise<FetchUserHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )
    return { checkIns }
  }
}
