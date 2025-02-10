import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
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