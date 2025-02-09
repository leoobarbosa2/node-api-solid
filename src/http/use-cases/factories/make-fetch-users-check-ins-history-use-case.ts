import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'
import { PrimaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeFetchUsersCheckInsHistoryUseCase() {
  const checkInsRepository = new PrimaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}

