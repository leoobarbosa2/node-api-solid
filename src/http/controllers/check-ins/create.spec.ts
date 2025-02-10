import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser'
import { prisma } from '@/lib/prisma'

describe('Create Check In [e2e]', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { id } = await prisma.gym.create({
      data: {
        title: 'Javascript',
        latitude: -24.5676566,
        longitude: -47.6178385,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -24.5676566,
        longitude: -47.6178385,
      })

    expect(response.statusCode).toEqual(201)
  })
})