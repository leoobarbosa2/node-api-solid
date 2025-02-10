import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchUsersCheckInsHistoryUseCase } from '@/http/use-cases/factories/make-fetch-users-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryBodySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryBodySchema.parse(request.params)

  const searchGymsUseCase = makeFetchUsersCheckInsHistoryUseCase()

  const { checkIns } =await searchGymsUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}