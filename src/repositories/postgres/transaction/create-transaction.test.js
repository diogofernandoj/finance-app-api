import { PostgresCreateTransactionRepository } from "./create-transaction";
import { transaction, user } from "../../../tests";
import { prisma } from "../../../../prisma/prisma";
import dayjs from "dayjs";

describe("PostgresCreateTransactionRepository", () => {
  it("should create a transaction on db", async () => {
    const sut = new PostgresCreateTransactionRepository();
    await prisma.user.create({ data: user });

    const res = await sut.execute({ ...transaction, user_id: user.id });

    expect(res.name).toBe(transaction.name);
    expect(res.type).toBe(transaction.type);
    expect(res.user_id).toBe(user.id);
    expect(String(res.amount)).toBe(String(transaction.amount));
    expect(dayjs(res.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(res.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(res.date).year()).toBe(dayjs(transaction.date).year());
  });

  it("should call Prisma with correct params", async () => {
    await prisma.user.create({ data: user });
    const sut = new PostgresCreateTransactionRepository();
    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "create");

    await sut.execute({ ...transaction, user_id: user.id });

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...transaction,
        user_id: user.id,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresCreateTransactionRepository();
    import.meta.jest
      .spyOn(prisma.transaction, "create")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(transaction);

    await expect(res).rejects.toThrow();
  });
});
