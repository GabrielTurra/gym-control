import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users.repository";
import { hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";
import { UserInvalidCredentialsError } from "./err/user-invalid-credentials.error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;


describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password_hash: await hash("123456", 6),
    });
    
    const { user } = await sut.execute({
      email: "johndoe@test.com",
      password: "123456"
    });
    
    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() => 
      sut.execute({
        email: "wrongjohndoe@test.com",
        password: "123456"
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError); 
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() => 
      sut.execute({
        email: "johndoe@test.com",
        password: "wrongpass"
      }),
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError); 
  });
});