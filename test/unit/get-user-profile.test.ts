import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile'
import { hash } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
// system uder test
let sut: GetUserProfileUseCase
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able get an user profile', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john_doe@test.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ id: newUser.id })

    expect(user.id).toEqual('user-1')
  })

  it('should not be able to get a profile from user that does not exists', async () => {
    expect(async () => {
      await sut.execute({ id: 'not-valid-id' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
