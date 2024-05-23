import request from "supertest";

import { app } from "../app.js";
import { user, transaction } from "../tests/index.js";

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
});
