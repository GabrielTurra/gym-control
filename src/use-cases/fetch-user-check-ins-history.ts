import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/types/check-ins.repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page: number;
}

interface FecthUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ){}

  async execute({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FecthUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

    return {
      checkIns,
    };
  }
}