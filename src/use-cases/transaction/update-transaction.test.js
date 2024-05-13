import { faker } from "@faker-js/faker";
import { UpdateTransactionUseCase } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("UpdateTransactionUseCase", () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    title: faker.string.alpha(10),
    date: faker.date.anytime().toISOString(),
    type: faker.helpers.enumValue(TransactionType),
    amount: faker.number.float(),
  };

  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        ...transaction,
      };
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionUseCase(updateTransactionRepository);

    return { sut, updateTransactionRepository };
  };

  it("should update a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(transaction.id, {
      title: faker.string.alpha(10),
      date: faker.date.anytime().toISOString(),
      type: faker.helpers.enumValue(TransactionType),
      amount: faker.number.float(),
    });

    // assert
    expect(res).toEqual(transaction);
  });

  it("should call UpdateTransactionRepository with correct params", async () => {
    // arrange
    const { sut, updateTransactionRepository } = makeSut();
    const executeSpy = jest.spyOn(updateTransactionRepository, "execute");

    // act
    await sut.execute(transaction.id, {
      title: transaction.title,
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
      title: transaction.title,
    });
  });
});
