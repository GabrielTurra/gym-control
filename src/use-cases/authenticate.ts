import { UsersRepository } from "@/repositories/types/users.repository";
import { UserInvalidCredentialsError } from "./err/user-invalid-credentials.error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthencticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthencticateUseCaseResponse {
    user: User;
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository
  ){}

  async execute({ email, password }: AuthencticateUseCaseRequest): Promise<AuthencticateUseCaseResponse> {
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