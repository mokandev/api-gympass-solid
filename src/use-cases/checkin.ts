import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { GymsRepository } from '@/repositories/interfaces/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  validatedAt?: Date
  userLatitute: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

interface ICheckInUseCase {
  execute(params: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>
}
export class CheckInUseCase implements ICheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    validatedAt,
    userLatitute,
    userLongitude,
  }: CheckInUseCaseRequest) {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculate the distance between two points
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitute,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckinsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
      validated_at: validatedAt,
    })

    return { checkIn }
  }
}
