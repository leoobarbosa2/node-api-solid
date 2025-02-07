import { expect, describe, it, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvaidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await bcrypt.hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be NOT be able to authenticate with wrong e-mail', async () => {
    await expect(() => sut.execute({
      email: 'johnode@email.com',
      password: '123456',
    })).rejects.toBeInstanceOf(InvaidCredentialsError)
  })

  it('should be NOT be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await bcrypt.hash('123456', 6),
    })

    await expect(() => sut.execute({
      email: 'johnode@email.com',
      password: '654321',
    })).rejects.toBeInstanceOf(InvaidCredentialsError)
  })
})
