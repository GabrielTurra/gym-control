import request from "supertest";
import { app } from "@/app";
import { it, describe, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Search nearby Gyms E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Shoud be able to search nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        description: "Some description here",
        phone: "11999999999",
        latitude: -23.5205345,
        longitude: -46.6054147,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        description: "Some description here",
        phone: "11999999999",
        latitude: -16.4563535,
        longitude: -54.6360352,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: -23.5205345,
        longitude: -46.6054147,
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym"
      })
    ]);
  });
});