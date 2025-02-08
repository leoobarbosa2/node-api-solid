import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyUseCase(gymsRepository)
  })

  it('should be able fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -22.8508047,
      longitude: -47.1119346,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: -24.5676566,
      longitude: -47.6178385,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.8501544,
      userLongitude: -47.1120892,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
