import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrimaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsUseCase() {
  const checkInsRepositor = new PrimaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepositor)

  return useCase
}

