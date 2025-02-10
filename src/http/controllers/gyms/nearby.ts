import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/http/use-cases/factories/make-fetch-nearby-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymsQuerySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearByGymsQuerySchema.parse(request.params)

  const searchGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } =await searchGymsUseCase.execute({ userLatitude: latitude, userLongitude: longitude })

  return reply.status(200).send({
    gyms,
  })
}