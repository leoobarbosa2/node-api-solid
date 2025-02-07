import { UsersRepository } from '@/repositories/users-repository'
import { InvaidCredentialsError } from './errors/invalid-credentials-error'
import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if(!user) {
      throw new InvaidCredentialsError()
    }

    const doesPasswordMatches = await bcrypt.compare(password, user.password_hash)

    if(!doesPasswordMatches) {
      throw new InvaidCredentialsError()
    }

    return { user }
  }
}