import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeValidateCheckInUseCase } from '@/http/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const createCheckInUseCase = makeValidateCheckInUseCase()

  await createCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}