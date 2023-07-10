import { expect, describe, it } from "vitest";
import { RegisterService } from "./register.service";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users.repository.in-memory";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./err/user-already-exists.error";

describe("Register Service", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);
    
    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johdoe@test.com",
      password: "123456"
    });
    
    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: "John Doe",
      email: "johdoe@test.com",
      password: "123456"
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash    
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not to be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const email = "johdoe@test.com";

    await registerService.execute({
      name: "John Doe",
      email,
      password: "123456"
    });

    expect(() => 
      registerService.execute({
        name: "John Doe",
        email,
        password: "123456"
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);   
  });
});