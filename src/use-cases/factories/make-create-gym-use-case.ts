import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const userRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(userRepository);

  return createGymUseCase;
}