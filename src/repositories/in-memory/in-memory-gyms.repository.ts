import { Gym } from "@prisma/client";
import { GymsRepository } from "../types/gyms.reposity";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find(item => item.id === id);
    return gym || null;
  }
}