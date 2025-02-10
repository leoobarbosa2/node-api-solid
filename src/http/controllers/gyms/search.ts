import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsUseCaseUseCase } from '@/http/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, query } = searchGymQuerySchema.parse(request.params)

  const searchGymsUseCase = makeSearchGymsUseCaseUseCase()

  const { gyms } =await searchGymsUseCase.execute({ query, page })

  return reply.status(200).send({
    gyms,
  })
}