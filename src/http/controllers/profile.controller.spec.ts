import request from "supertest";
import { app } from "@/app";
import { it, describe, expect, beforeAll, afterAll } from "vitest";

describe("Profile E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Shoud be able to get user profile data", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "John Doe",    
        email: "johndoe@example.com",
        password: "123456"
      });

    const authResponse = await request(app.server)
      .post("/sessions")
      .send({
        email: "johndoe@example.com",
        password: "123456"
      });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(expect.objectContaining({
      email: "johndoe@example.com"
    }));
  });
});