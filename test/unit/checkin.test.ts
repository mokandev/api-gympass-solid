import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from '@/use-cases/checkin'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckinsError } from '@/use-cases/errors/max-number-of-checkins-error'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
// system uder test
let sut: CheckInUseCase
describe('CheckIns Repository', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    vi.setSystemTime(new Date(2024, 4, 16, 8, 0, 0))

    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: new Decimal(52.1076717),
      longitude: new Decimal(4.2773135),
      description: '',
      phone: '',
    })

    const newCheckIn = {
      gym_id: 'gym-1',
      user_id: 'user-1',
      validated_at: new Date(),
    }

    const { checkIn } = await sut.execute({
      gymId: newCheckIn.gym_id,
      userId: newCheckIn.user_id,
      validatedAt: newCheckIn.validated_at,
      userLatitute: 52.1076717,
      userLongitude: 4.2773135,
    })

    expect(checkIn.id).toEqual('check-in-1')
  })

  it('should not be able to checkin twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 4, 16, 8, 0, 0))

    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: new Decimal(52.1076717),
      longitude: new Decimal(4.2773135),
      description: '',
      phone: '',
    })

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: 52.1076717,
      userLongitude: 4.2773135,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitute: 52.1076717,
        userLongitude: 4.2773135,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError)
  })

  it('should be able to checkin twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 4, 16, 8, 0, 0))

    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: new Decimal(52.1076717),
      longitude: new Decimal(4.2773135),
      description: '',
      phone: '',
    })

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: 52.1076717,
      userLongitude: 4.2773135,
    })

    vi.setSystemTime(new Date(2024, 4, 17, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: 52.1076717,
      userLongitude: 4.2773135,
    })

    expect(checkIn.id).toEqual('check-in-1')
  })

  it('should not be able to check in n distant gym', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: new Decimal(52.1256614),
      longitude: new Decimal(4.3042831),
      description: '',
      phone: '',
    })

    const newCheckIn = {
      gym_id: 'gym-1',
      user_id: 'user-1',
      validated_at: new Date(),
    }

    await expect(() =>
      sut.execute({
        gymId: newCheckIn.gym_id,
        userId: newCheckIn.user_id,
        validatedAt: newCheckIn.validated_at,
        userLatitute: 52.1076717,
        userLongitude: 4.2773135,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
