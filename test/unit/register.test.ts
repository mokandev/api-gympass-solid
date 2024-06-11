import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUserCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { expect, it, describe, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserCase(usersRepository)
  })
  it('should be able to register', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    const { user } = await sut.createUser(newUser)

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    const { user } = await sut.createUser(newUser)

    const isPasswordCorrectlyHashed = await compare(
      newUser.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be possible to create an user with duplicated email', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john_doe@test.com',
      password: '123456',
    }

    await sut.createUser(newUser)

    expect(async () => {
      await sut.createUser(newUser)
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
