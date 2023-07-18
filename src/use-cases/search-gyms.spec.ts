import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });
  
  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      latitude: -23.5205345,
      longitude: -46.6054147,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      latitude: -23.5205345,
      longitude: -46.6054147,
    });

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    });
    
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to search paginated gyms", async () => {
    for(let i = 1; i <= 22; i++){
      await gymsRepository.create({
        title: `Test Gym ${i}`,
        latitude: -23.5205345,
        longitude: -46.6054147,
      });
    }

    const { gyms } = await sut.execute({
      query: "Test",
      page: 2,
    });
    
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Test Gym 21" }),
      expect.objectContaining({ title: "Test Gym 22" }),
    ]);
  });
});