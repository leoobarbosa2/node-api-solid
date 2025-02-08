import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data?.id ?? randomUUID(),
      title: data.title,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      description: data.description ?? null,
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(gym => gym.id === id)

    if(!gym) {
      return null
    }

    return gym
  }
}
