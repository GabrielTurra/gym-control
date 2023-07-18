import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/types/gyms.reposity";

interface FetchNearbyGymsUseCaseProps {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({ 
    userLatitude,
    userLongitude
  }: FetchNearbyGymsUseCaseProps): Promise<FetchNearbyGymsUseCaseResponse> {          
    const gyms = await this.gymRepository.findManyNearby({ 
      latitude: userLatitude, 
      longitude: userLongitude 
    });

    return {
      gyms
    };
  }
}