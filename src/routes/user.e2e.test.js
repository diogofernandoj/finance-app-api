import request from "supertest";

import { app } from "../app.js";
import { user } from "../tests/index.js";
import { faker } from "@faker-js/faker";
import { TransactionType } from "@prisma/client";

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
      .send(user);

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

  it("DELETE /api/users/:userId should return 200 when user is deleted", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const res = await request(app).delete(`/api/users/${createdUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(createdUser);
  });

  it("GET /api/users/:userId/balance should return 200 and correct balance", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      title: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EARNING,
      amount: 10000,
    });

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      title: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EXPENSE,
      amount: 2000,
    });

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      title: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.INVESTMENT,
      amount: 2000,
    });

    const res = await request(app).get(`/api/users/${createdUser.id}/balance`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      earnings: "10000",
      expenses: "2000",
      investments: "2000",
      balance: "6000",
    });
  });

  it("GET /api/users/:userId should return 404 when user is not found", async () => {
    const res = await request(app).get(`/api/users/${faker.string.uuid()}`);

    expect(res.status).toBe(404);
  });

  it("GET /api/users/:userId/balance should return 404 when user is not found", async () => {
    const res = await request(app).get(
      `/api/users/${faker.string.uuid()}/balance`,
    );

    expect(res.status).toBe(404);
  });

  it("PATCH /api/users/:userId should return 404 when user is not found", async () => {
    const res = await request(app)
      .patch(`/api/users/${faker.string.uuid()}`)
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(res.status).toBe(404);
  });

  it("POST /api/users should return 400 when the provided e-mail is already in use", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const res = await request(app)
      .post("/api/users")
      .send({
        ...user,
        email: createdUser.email,
      });

    expect(res.status).toBe(400);
  });
});
