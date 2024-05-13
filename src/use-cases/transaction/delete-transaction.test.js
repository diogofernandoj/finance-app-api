import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("DeleteTransactionUseCase", () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    title: faker.string.alpha(10),
    date: faker.date.anytime().toISOString(),
    type: faker.helpers.enumValue(TransactionType),
    amount: faker.number.float(),
  };
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...transaction, id: transactionId };
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

    return { sut, deleteTransactionRepository };
  };

  it("should delete a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    // act
    const res = await sut.execute(transactionId);

    // assert
    expect(res).toEqual({ ...transaction, id: transactionId });
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    const executeSpy = jest.spyOn(deleteTransactionRepository, "execute");

    // act
    await sut.execute(transaction.id);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    jest
      .spyOn(deleteTransactionRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(transaction.id);

    // assert
    await expect(res).rejects.toThrow();
  });
});
