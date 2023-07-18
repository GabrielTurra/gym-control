import { Gym, Prisma } from "@prisma/client";
import { GymsRepository, findManyNearbyParams } from "../types/gyms.reposity";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordnates";

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

  async searchMany(query: string, page: number) {
    const gym = this.gyms
      .filter(item => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
    return gym;
  }

  async findManyNearby({ latitude, longitude }: findManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber(),  }
      );

      return distance < 10;
    });
  }
}