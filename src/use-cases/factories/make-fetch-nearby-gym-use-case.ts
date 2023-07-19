import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";

export function makeFetchNearbyGymUseCase() {
  const userRepository = new PrismaGymsRepository();
  const fetchNearbyGymUseCase = new FetchNearbyGymsUseCase(userRepository);

  return fetchNearbyGymUseCase;
}