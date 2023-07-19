import request from "supertest";
import { app } from "@/app";
import { it, describe, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user";

describe("Search Gyms E2E", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Shoud be able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "Some description here",
        phone: "11999999999",
        latitude: -23.5205345,
        longitude: -46.6054147,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gym",
        description: "Some description here",
        phone: "11999999999",
        latitude: -27.5205345,
        longitude: -42.6054147,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Javascript"
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym"
      })
    ]);
  });
});