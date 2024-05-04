import { faker } from "@faker-js/faker";
import { UpdateTransactionController } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("UpdateTransactionController", () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        title: faker.string.alpha(10),
        date: faker.date.anytime().toISOString(),
        amount: faker.number.float(),
        type: faker.helpers.enumValue(TransactionType),
      };
    }
  }

  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return { sut, updateTransactionUseCase };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      title: faker.string.alpha(10),
      date: faker.date.anytime().toISOString(),
      amount: faker.number.float(),
      type: faker.helpers.enumValue(TransactionType),
    },
  };

  it("should return 200 on updating a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 when transaction id is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ params: { transactionId: "invalid_id" } });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when some provided field is not allowed", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: { ...httpRequest.body, unallowedField: "" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when amount is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: { ...httpRequest.body, amount: "invalid_amount" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when type is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: { ...httpRequest.body, type: "invalid_type" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when transaction is not found", async () => {
    // arrange
    const { sut, updateTransactionUseCase } = makeSut();
    jest.spyOn(updateTransactionUseCase, "execute").mockResolvedValueOnce(null);

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 when UpdateTransactionUseCase throws", async () => {
    // arrange
    const { sut, updateTransactionUseCase } = makeSut();
    jest
      .spyOn(updateTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should call UpdateTransactionUseCase with correct params", async () => {
    // arrange
    const { sut, updateTransactionUseCase } = makeSut();
    const executeSpy = jest.spyOn(updateTransactionUseCase, "execute");

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.transactionId,
      httpRequest.body,
    );
  });
});
