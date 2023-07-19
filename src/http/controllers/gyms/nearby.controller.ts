import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchNearbyGymUseCase } from "@/use-cases/factories/make-fetch-nearby-gym-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsBodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90; 
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180; 
    }),
  });

  const { latitude, longitude } = nearbyGymsBodySchema.parse(request.body);

  const nearbyGymUseCase = makeFetchNearbyGymUseCase();

  const { gyms } = await nearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms
  });
}