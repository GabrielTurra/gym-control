import { UsersRepository } from "@/repositories/types/users.repository";
import { UserInvalidCredentialsError } from "./err/user-invalid-credentials.error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthencticateServiceRequest {
    email: string;
    password: string;
}

interface AuthencticateServiceResponse {
    user: User;
}

export class AuthenticateService {
  constructor(
    private usersRepository: UsersRepository
  ){}

  async execute({ email, password }: AuthencticateServiceRequest): Promise<AuthencticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new UserInvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if(!doesPasswordMatches) {
      throw new UserInvalidCredentialsError();
    }

    return {
      user,
    };
  }
}