import { PostgresDeleteTransactionRepository } from "../index.js";
import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../tests/index.js";
import dayjs from "dayjs";

describe("PosgtgresDeleteTransactionRepository", () => {
  const sut = new PostgresDeleteTransactionRepository();

  it("should delete a transaction on db", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const res = await sut.execute(transaction.id);

    expect(res.title).toBe(transaction.title);
    expect(res.type).toBe(transaction.type);
    expect(res.user_id).toBe(user.id);
    expect(res.amount.toString()).toBe(transaction.amount.toString());
    expect(dayjs(res.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(res.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(res.date).year()).toBe(dayjs(transaction.date).year());
  });
});
