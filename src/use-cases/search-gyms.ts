import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/types/gyms.reposity";

interface SearchGymsUseCaseProps {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({ 
    query,
    page
  }: SearchGymsUseCaseProps): Promise<SearchGymsUseCaseResponse> {          
    const gyms = await this.gymRepository.searchMany(query, page);

    return {
      gyms
    };
  }
}