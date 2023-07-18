import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/check-ins.repository.in-memory";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "crypto";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  
  it("should be able to check-in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    });
    
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });
    
    await expect(() => sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    })).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check-in in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });
    
    expect(checkIn.id).toEqual(expect.any(String));
  });
});