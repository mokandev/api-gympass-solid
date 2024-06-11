import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'
import { expect, it, describe, beforeEach } from 'vitest'

let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })
  it('should be able to create a gym', async () => {
    const { gym } = await sut.createGym({
      title: 'Gym do JavaScript',
      latitude: 0,
      longitude: 0,
      description: '',
      phone: '',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
