import request from "supertest";

import { app } from "../../index.js";
import { user } from "../tests/index.js";

describe("User Routes E2E Tests", () => {
  it("POST /api/users should return 201 when user is created", async () => {
    const res = await request(app).post("/api/users").send(user);

    expect(res.statusCode).toBe(201);
  });
});
