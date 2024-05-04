import { faker } from "@faker-js/faker";
import { CreateTransactionController } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("CreateTransactionController", () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction;
    }
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);

    return { sut, createTransactionUseCase };
  };

  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      title: faker.lorem.word(),
      date: faker.date.anytime().toISOString(),
      type: faker.helpers.enumValue(TransactionType),
      amount: faker.number.float({ min: 1 }),
    },
  };

  it("should return 201 on creating a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(201);
  });

  it("should return 400 when user_id is missing", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, user_id: null },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when title is missing", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, title: null },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when date is missing", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, date: null },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when amount is missing", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, amount: null },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when type is missing", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, type: null },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when date is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, date: "invalid_date" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when type is not valid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, type: "invalid_type" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 when amount is not a valid currency", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      body: { ...httpRequest.body, amount: "invalid_amount" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 500 when CreateTransactionUseCase throws", async () => {
    // arrange
    const { sut, createTransactionUseCase } = makeSut();
    jest
      .spyOn(createTransactionUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });
});
