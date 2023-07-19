import { FastifyInstance } from "fastify";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./create.controller";
import { validate } from "./validate.controller";
import { history } from "./history.controller";
import { metrics } from "./metrics.controller";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);
  
  app.post("/check-ins/:gymId", create);
  app.patch("/check-ins/:checkInId/validate", validate);
} 