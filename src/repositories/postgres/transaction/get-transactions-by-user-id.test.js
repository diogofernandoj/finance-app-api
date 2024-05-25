import dayjs from "dayjs";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction, user } from "../../../tests/index.js";
import { PostgresGetTransactionsByUserIdRepository } from "../index.js";

describe("PostgresTransactionsyUserId", () => {
  const sut = new PostgresGetTransactionsByUserIdRepository();

  it("should get transactions by user id on db", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const res = await sut.execute(user.id);

    expect(res.length).toBe(1);
    expect(res[0].title).toBe(transaction.title);
    expect(res[0].type).toBe(transaction.type);
    expect(res[0].user_id).toBe(user.id);
    expect(String(res[0].amount)).toBe(String(transaction.amount));
    expect(dayjs(res[0].date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(res[0].date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(res[0].date).year()).toBe(dayjs(transaction.date).year());
  });

  it("should call Prisma with correct params", async () => {
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "findMany");

    await sut.execute(user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    import.meta.jest
      .spyOn(prisma.transaction, "findMany")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(user.id);

    await expect(res).rejects.toThrow();
  });
});
