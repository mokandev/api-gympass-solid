import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
// system uder test
let sut: AuthenticateUseCase
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    await usersRepository.create({
      name: newUser.name,
      email: newUser.email,
      password_hash: await hash(newUser.password, 6),
    })

    const { user } = await sut.execute(newUser)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    expect(async () => {
      await sut.execute({ email: newUser.email, password: newUser.password })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    await usersRepository.create({
      name: newUser.name,
      email: newUser.email,
      password_hash: await hash(newUser.password, 6),
    })

    expect(async () => {
      await sut.execute({ email: newUser.email, password: '123123' })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
