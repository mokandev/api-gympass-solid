import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from 'test/utils/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '3522 4999',
        latitude: 52.1256614,
        longitude: 4.3042831,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: 52.1256614,
        longitude: 4.3042831,
      })

    expect(response.statusCode).toEqual(201)
  })
})
