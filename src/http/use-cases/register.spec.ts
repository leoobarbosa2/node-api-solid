import { expect, describe, it, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

const email = 'johndoe@email.com'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await bcrypt.compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should NOT be able to register with the same email twice', async () => {
    await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() => sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
