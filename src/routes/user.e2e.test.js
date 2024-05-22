import request from "supertest";

import { app } from "../app.js";
import { user } from "../tests/index.js";

describe("User Routes E2E Tests", () => {
  it("POST /api/users should return 201 when user is created", async () => {
    const res = await request(app).post("/api/users").send(user);

    expect(res.statusCode).toBe(201);
  });

  it("GET /api/users/:userId should return 200 when user is found", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const res = await request(app).get(`/api/users/${createdUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(createdUser);
  });
});
