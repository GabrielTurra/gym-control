import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/types/check-ins.repository";
import { ResourceNotFoundError } from "./err/resource-not-found";
import dayjs from "dayjs";
import { LateCheckInValidateError } from "./err/late-check-in-validate";

interface ValidateCheckInUseCaseRequest {
    checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor( private checkInsRepository: CheckInsRepository ){}

  async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if(!checkIn){
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at, 
      "minutes"
    );

    if(distanceInMinutesFromCheckInCreation > 20){
      throw new LateCheckInValidateError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}