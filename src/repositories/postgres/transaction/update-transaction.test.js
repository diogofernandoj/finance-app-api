import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction, user } from "../../../tests/index.js";
import { PostgresUpdateTransactionRepository } from "../index.js";
import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TransactionNotFoundError } from "../../../errors/transaction.js";

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
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "update");

    await sut.execute(transaction.id, { ...transaction, user_id: user.id });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: { ...transaction, user_id: user.id },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresUpdateTransactionRepository();
    import.meta.jest
      .spyOn(prisma.transaction, "update")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(transaction.id, transaction);

    await expect(res).rejects.toThrow();
  });

  it("should throw TransactionNotFoundError if Prisma does not find record to update", async () => {
    const sut = new PostgresUpdateTransactionRepository();
    import.meta.jest.spyOn(prisma.transaction, "update").mockRejectedValueOnce(
      new PrismaClientKnownRequestError("", {
        code: "P2025",
      }),
    );

    const res = sut.execute(transaction.id, transaction);

    await expect(res).rejects.toThrow(
      new TransactionNotFoundError(transaction.id),
    );
  });
});
