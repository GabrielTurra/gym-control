import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users.repository.in-memory";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./err/user-already-exists.error";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  
  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456"
    });
    
    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456"
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash    
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not to be able to register with same email twice", async () => {
    const email = "johndoe@test.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456"
    });

    await expect(() => 
      sut.execute({
        name: "John Doe",
        email,
        password: "123456"
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);   
  });
});