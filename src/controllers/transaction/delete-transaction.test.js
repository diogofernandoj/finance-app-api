import { faker } from "@faker-js/faker";
import { DeleteTransactionController } from "../index.js";
import { transaction } from "../../tests/index.js";
import { TransactionNotFoundError } from "../../errors/transaction.js";

describe("DeleteTransactionController", () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return { sut, deleteTransactionUseCase };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
  };

  it("should return 200 on deleting a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 when id is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ params: { transactionId: "invalid_id" } });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when no transaction is found", async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionUseCase, "execute")
      .mockRejectedValueOnce(
        new TransactionNotFoundError(httpRequest.params.transactionId),
      );

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 when DeleteTransactionUseCase throws", async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    import.meta.jest
      .spyOn(deleteTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should call DeleteTransactionUseCase with correct params", async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      deleteTransactionUseCase,
      "execute",
    );

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.transactionId);
  });
});
