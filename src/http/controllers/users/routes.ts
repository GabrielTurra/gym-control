import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

import { register } from "./register.controller";
import { authenticate } from "./authenticate.controller";
import { profile } from "./profile.controller";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get("/me", { onRequest: [VerifyJWT] }, profile);
} 