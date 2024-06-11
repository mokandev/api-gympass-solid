import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, it, describe, beforeEach } from 'vitest'

let gymRepository: InMemoryGymsRepository
// system uder test
let sut: FetchNearbyGymsUseCase
describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymRepository)
  })
  it('should be able to fetch nearby gyms', async () => {
    await gymRepository.create({
      title: 'Near Gym',
      latitude: new Decimal(52.1256614),
      longitude: new Decimal(4.3042831),
      description: '',
      phone: '',
    })

    await gymRepository.create({
      title: 'Far Gym',
      latitude: new Decimal(52.213707),
      longitude: new Decimal(4.5568227),
      description: '',
      phone: '',
    })

    const { gyms } = await sut.execute({
      userLatitute: 52.1076717,
      userLongitude: 4.2773135,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
