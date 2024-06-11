import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { FetchUserHistoryUseCase } from '@/use-cases/fetch-user-checkins-history'
import { expect, it, describe, beforeEach } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
// system uder test
let sut: FetchUserHistoryUseCase
describe('Fetch User Check-ins Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserHistoryUseCase(checkInsRepository)
  })

  it('should be able to retrive all user check-ins history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(2)

    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
      }),
      expect.objectContaining({
        gym_id: 'gym-02',
      }),
    ])
  })

  it('should be able to retrive all check-ins user history paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-21',
      }),
      expect.objectContaining({
        gym_id: 'gym-22',
      }),
    ])
  })
})
