import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });
  
  it("should be able to search for nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      latitude: -23.5205345,
      longitude: -46.6054147,
    });

    await gymsRepository.create({
      title: "Far Gym",
      latitude: -16.4563535,
      longitude: -54.6360352,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5205345,
      userLongitude: -46.6054147,
    });
    
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
    ]);
  });
});