import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNearbyParams,
  GymsRepository,
} from '../interfaces/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(gymId: string) {
    const gym = this.gyms.find((g) => g.id === gymId)

    if (!gym) return null

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: 'gym-1',
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const MAX_ALLOWED_DISTANCE_IN_KM = 10
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < MAX_ALLOWED_DISTANCE_IN_KM
    })
  }
}
