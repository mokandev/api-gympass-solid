import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkin-repository'
import { GetUserMetricsUseCase } from '@/use-cases/get-user-metrics'
import { expect, it, describe, beforeEach } from 'vitest'

let checkInsRepository: InMemoryCheckInsRepository
// system uder test
let sut: GetUserMetricsUseCase
describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get user check-ins count', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(2)
  })
})
