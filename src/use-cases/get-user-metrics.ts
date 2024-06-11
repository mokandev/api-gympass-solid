import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

interface IGetUserMetricsUseCase {
  execute(
    params: GetUserMetricsUseCaseRequest,
  ): Promise<GetUserMetricsUseCaseResponse>
}
export class GetUserMetricsUseCase implements IGetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }
}
