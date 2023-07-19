import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1)
  });

  const { page, query } = searchGymsBodySchema.parse(request.body);

  const searchGymUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymUseCase.execute({
    query,
    page
  });

  return reply.status(200).send({
    gyms
  });
}