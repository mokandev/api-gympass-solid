import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInUseCase } from '../checkin'
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'

export const makeCheckInUseCase = () => {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const prismaGymsRepository = new PrismaGymRepository()
  const checkInUseCase = new CheckInUseCase(
    prismaCheckInRepository,
    prismaGymsRepository,
  )
  return checkInUseCase
}
