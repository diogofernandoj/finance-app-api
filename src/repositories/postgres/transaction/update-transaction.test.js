import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction, user } from "../../../tests/index.js";
import { PostgresUpdateTransactionRepository } from "../index.js";
import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";

describe("PostgresUpdateTransactionRepository", () => {
  it("should update a transaction on db", async () => {
    const sut = new PostgresUpdateTransactionRepository();
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const params = {
      title: faker.string.alpha(10),
      date: faker.date.anytime().toISOString(),
      type: TransactionType.EXPENSE,
      amount: faker.number.float({ fractionDigits: 2 }),
    };

    const res = await sut.execute(transaction.id, params);

    expect(res.title).toBe(params.title);
    expect(res.type).toBe(params.type);
    expect(res.user_id).toBe(user.id);
    expect(res.amount.toString()).toBe(params.amount.toString());
    expect(dayjs(res.date).daysInMonth()).toBe(
      dayjs(params.date).daysInMonth(),
    );
    expect(dayjs(res.date).month()).toBe(dayjs(params.date).month());
    expect(dayjs(res.date).year()).toBe(dayjs(params.date).year());
  });

  it("should call Prisma with correct params", async () => {
    const sut = new PostgresUpdateTransactionRepository();
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const prismaSpy = jest.spyOn(prisma.transaction, "update");

    await sut.execute(transaction.id, { ...transaction, user_id: user.id });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: { ...transaction, user_id: user.id },
    });
  });
});
