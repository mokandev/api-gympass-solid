import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface FetchNearbyGymsUseCaseRequest {
  userLatitute: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

interface IFetchNearbyGymsUseCase {
  execute(
    params: FetchNearbyGymsUseCaseRequest,
  ): Promise<FetchNearbyGymsUseCaseResponse>
}
export class FetchNearbyGymsUseCase implements IFetchNearbyGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    userLatitute,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest) {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitute,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
