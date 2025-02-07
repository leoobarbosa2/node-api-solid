import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository{
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const userbyEmail = await prisma.user.findUnique({ where: { email } })

    return userbyEmail
  }

  async findById(userId: string) {
    const userbyId = await prisma.user.findUnique({ where: { id: userId } })

    return userbyId
  }
}

