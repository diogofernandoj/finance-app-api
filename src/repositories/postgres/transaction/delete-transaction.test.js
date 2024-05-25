import { PostgresDeleteTransactionRepository } from "../index.js";
import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../tests/index.js";
import dayjs from "dayjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TransactionNotFoundError } from "../../../errors/transaction.js";

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

  it("should call Prisma with correct params", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "delete");

    await sut.execute(transaction.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    });
  });

  it("should throw generic error if Prisma throws generic error", async () => {
    const sut = new PostgresDeleteTransactionRepository();
    import.meta.jest
      .spyOn(prisma.transaction, "delete")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(transaction.id);

    await expect(res).rejects.toThrow();
  });

  it("should throw TransactionNotFoundError if Prisma does not find a transaction", async () => {
    const sut = new PostgresDeleteTransactionRepository();
    import.meta.jest.spyOn(prisma.transaction, "delete").mockRejectedValueOnce(
      new PrismaClientKnownRequestError("", {
        code: "P2025",
      }),
    );

    const res = sut.execute(transaction.id);

    await expect(res).rejects.toThrow(
      new TransactionNotFoundError(transaction.id),
    );
  });
});
