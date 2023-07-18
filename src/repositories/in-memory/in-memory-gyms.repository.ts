import { Gym, Prisma } from "@prisma/client";
import { GymsRepository } from "../types/gyms.reposity";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.gyms.push(gym);
    return gym;
  }

  async findById(id: string) {
    const gym = this.gyms.find(item => item.id === id);
    return gym || null;
  }
}