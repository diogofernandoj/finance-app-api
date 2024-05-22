import request from "supertest";

import { app } from "../app.js";
import { user } from "../tests/index.js";
import { faker } from "@faker-js/faker";

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

  it("PATCH /api/users/:userId should return 200 when user is updated", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const updateUserParams = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await request(app)
      .patch(`/api/users/${createdUser.id}`)
      .send(updateUserParams);

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(updateUserParams.firstName);
    expect(res.body.lastName).toBe(updateUserParams.lastName);
    expect(res.body.email).toBe(updateUserParams.email);
    expect(res.body.password).not.toBe(createdUser.password);
  });
});
