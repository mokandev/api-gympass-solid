import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/interfaces/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

interface ICreateGymUseCase {
  createGym(params: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse>
}

export class CreateGymUseCase implements ICreateGymUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async createGym({
    title,
    description,
    latitude,
    longitude,
    phone,
  }: CreateGymUseCaseRequest) {
    const gym = await this.gymRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone,
    })

    return { gym }
  }
}
