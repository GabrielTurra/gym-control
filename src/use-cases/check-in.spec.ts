import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins.repository";
import { CheckInUseCase } from "./check-in";
import { randomUUID } from "crypto";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Decimal } from "@prisma/client/runtime";
import { MaxNumberOfCheckInsError } from "./err/max-number-of-check-ins-error";
import { MaxDistanceError } from "./err/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  
  it("should be able to check-in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });
    
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });
    
    await expect(() => sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check-in in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });
    
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check-in on distant gym", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    gymsRepository.gyms.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      latitude: new Decimal(-23.5205345),
      longitude: new Decimal(-46.6054147),
      phone: "",
    });

    await expect(() => sut.execute({
      gymId: "gym-02",
      userId: "user-01",
      userLatitude: -23.4439484,
      userLongitude: -46.5258909,
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });
});