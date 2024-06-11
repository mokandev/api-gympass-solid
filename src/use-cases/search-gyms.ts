import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

interface ISearchGymsUseCase {
  execute(params: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse>
}
export class SearchGymsUseCase implements ISearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({ query, page }: SearchGymsUseCaseRequest) {
    const gyms = await this.gymRepository.searchMany(query, page)

    return { gyms }
  }
}
