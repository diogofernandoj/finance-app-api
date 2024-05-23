import request from "supertest";

import { app } from "../app.js";
import { user, transaction } from "../tests/index.js";
import { TransactionType } from "@prisma/client";

describe("Transaction Routes E2E Tests", () => {
  it("POST /api/transactions should return 201 when creating a transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const res = await request(app)
      .post("/api/transactions")
      .send({ ...transaction, user_id: createdUser.id });

    expect(res.status).toBe(201);
    expect(res.body.user_id).toBe(createdUser.id);
    expect(res.body.type).toBe(transaction.type);
    expect(res.body.amount).toBe(String(transaction.amount));
  });

  it("GET /api/transaction?userId should return 200 when fetching transactions successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const { body: createdTransaction } = await request(app)
      .post("/api/transactions")
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const res = await request(app).get(
      `/api/transactions?userId=${createdUser.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe(createdTransaction.id);
  });

  it("PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const { body: createdTransaction } = await request(app)
      .post("/api/transactions")
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const res = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .send({ amount: 100, type: TransactionType.INVESTMENT });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe("100");
    expect(res.body.type).toBe(TransactionType.INVESTMENT);
  });

  it("DELETE /api/transactions/:transactionId should return 200 when deleting a transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send(user);

    const { body: createdTransaction } = await request(app)
      .post("/api/transactions")
      .send({ ...transaction, user_id: createdUser.id, id: undefined });

    const res = await request(app).delete(
      `/api/transactions/${createdTransaction.id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdTransaction.id);
  });
});
