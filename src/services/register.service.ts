import { UsersRepository } from "@/repositories/types/users.repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./err/user-already-exists.error";
import { User } from "@prisma/client";

interface RegisterServiceProps {
    name: string;
    email: string;
    password: string;
}

interface RegisterServiceResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ 
    name, 
    email, 
    password
  }: RegisterServiceProps): Promise<RegisterServiceResponse> {          
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
      
    const user = await this.usersRepository.create({
      name, 
      email,
      password_hash
    });

    return {
      user
    };
  }
}