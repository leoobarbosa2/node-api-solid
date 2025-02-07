import { expect, describe, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { RegisterUseCase } from '../use-cases/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../use-cases/errors/user-already-exists-error'

const email = 'johndoe@email.com'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await bcrypt.compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should NOT be able to register with the same email twice', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    await registerUseCase.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })

    await expect(() => registerUseCase.execute({
      email,
      name: 'John Doe',
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
