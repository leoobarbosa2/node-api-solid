import { expect, describe, it, beforeEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach } from 'node:test'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsUseCase: InMemoryCheckInsRepository
let sut: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check Ins Use Case', () => {
  beforeEach(async () => {
    checkInsUseCase = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsUseCase, gymsRepository)

    await gymsRepository.create(
      {
        id: 'gym-01',
        title: 'Javascript Gym',
        description: '',
        latitude: -24.5676566,
        longitude: -47.6178385,
        phone: '',
      },
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check in', async () => {
    vi.setSystemTime(new Date(2020, 8, 29, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -24.5676566,
      userLongitude: -47.6178385,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should NOT be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2020, 8, 29, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -24.5676566,
      userLongitude: -47.6178385,
    })

    await expect(
      () => sut.execute({
        gymId: 'gym-01',
        userId: 'user-id-01',
        userLatitude: -24.5676566,
        userLongitude: -47.6178385,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2020, 8, 29, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -24.5676566,
      userLongitude: -47.6178385,
    })

    vi.setSystemTime(new Date(2020, 8, 30, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-id-01',
      userLatitude: -24.5676566,
      userLongitude: -47.6178385,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should NOT be able to check in distant from gym', async () => {
    vi.setSystemTime(new Date(2020, 8, 29, 8, 0, 0))

    await gymsRepository.create({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      latitude: new Decimal(-22.9212255),
      longitude: new Decimal(-47.0769253),
      phone: '',
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-id-01',
      userLatitude: -24.5676566,
      userLongitude: -47.6178385,
    }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
