import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import bcrypt from 'bcryptjs'

export async function createAndAuthenticateUser(app: FastifyInstance, role: 'ADMIN' | 'MEMBER') {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await bcrypt.hash('123456', 6),
      role,
    },
  })

  const authReponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'johndoe@mail.com',
      password: '123456',
    })

  const { token } = authReponse.body

  return {
    token,
  }
}