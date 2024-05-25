import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "../index.js";
import { transaction } from "../../tests/index.js";

describe("DeleteTransactionUseCase", () => {
  class DeleteTransactionRepositoryStub {
    async execute() {
      return transaction;
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
    expect(res).toEqual(transaction);
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      deleteTransactionRepository,
      "execute",
    );

    // act
    await sut.execute(transaction.id);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(transaction.id);

    // assert
    await expect(res).rejects.toThrow();
  });
});
