import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { user as fakeUser } from "../../../tests/index.js";
import { PostgresGetUserBalanceRepository } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("PostgresGetUserBalanceRepository", () => {
  const sut = new PostgresGetUserBalanceRepository();

  it("should get user balance on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          title: faker.string.alpha(10),
          amount: 5000,
          date: faker.date.recent().toISOString(),
          type: "EARNING",
          user_id: user.id,
        },
        {
          title: faker.string.alpha(10),
          date: faker.date.recent().toISOString(),
          amount: 5000,
          type: "EARNING",
          user_id: user.id,
        },
        {
          title: faker.string.alpha(10),
          date: faker.date.recent().toISOString(),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          title: faker.string.alpha(10),
          date: faker.date.recent().toISOString(),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          title: faker.string.alpha(10),
          date: faker.date.recent().toISOString(),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
        {
          title: faker.string.alpha(10),
          date: faker.date.recent().toISOString(),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
      ],
    });

    const res = await sut.execute(user.id);

    expect(res.earnings.toString()).toBe("10000");
    expect(res.expenses.toString()).toBe("2000");
    expect(res.investments.toString()).toBe("6000");
    expect(res.balance.toString()).toBe("2000");
  });

  it("should call prisma with correct params", async () => {
    const prismaSpy = jest.spyOn(prisma.transaction, "aggregate");

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    jest
      .spyOn(prisma.transaction, "aggregate")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(fakeUser.id);

    await expect(res).rejects.toThrow();
  });
});
