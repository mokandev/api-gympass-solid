import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in'
import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
// system uder test
let sut: ValidateCheckInUseCase
describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      user_id: 'User -1',
      gym_id: 'Gym - 1',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))

    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'not-valid-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to validate check-in after 20 minutes after its creation', async () => {
    vi.setSystemTime(new Date(2024, 17, 4, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      user_id: 'User -1',
      gym_id: 'Gym - 1',
    })

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
