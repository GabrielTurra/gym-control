import { Gym, Prisma } from "@prima/client";

export interface GymsRepository {
    create(data: Prisma.GymCreateInput): Promise<Gym | null>
    findById(id: string): Promise<Gym | null>
    searchMany(query: string, page: number): Promise<Gym[]>
}