import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";

export function makeSearchGymsUseCase() {
  const userRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymsUseCase(userRepository);

  return searchGymsUseCase;
}