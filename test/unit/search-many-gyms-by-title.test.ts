import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { Decimal } from '@prisma/client/runtime/library'
import { expect, it, describe, beforeEach } from 'vitest'

let gymRepository: InMemoryGymsRepository
// system uder test
let sut: SearchGymsUseCase
describe('Search Many Gyms Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })
  it('should be able to get a gym by name', async () => {
    await gymRepository.create({
      title: 'JavaScript Gym',
      latitude: new Decimal(52.1256614),
      longitude: new Decimal(4.3042831),
      description: '',
      phone: '',
    })

    const { gyms } = await sut.execute({ query: 'javaScript', page: 1 })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to get gyms by query paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `JavaScript Gym - ${i}`,
        latitude: new Decimal(52.1256614),
        longitude: new Decimal(4.3042831),
        description: '',
        phone: '',
      })
    }

    const { gyms } = await sut.execute({ query: 'javaScript', page: 2 })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym - 21' }),
      expect.objectContaining({ title: 'JavaScript Gym - 22' }),
    ])
  })
})
