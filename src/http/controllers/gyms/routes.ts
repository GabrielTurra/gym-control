import { FastifyInstance } from "fastify";
import { search } from "./search.controller";
import { nearby } from "./nearby.controller";
import { create } from "./create.controller";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);

  app.post("/gyms", create);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);
} 