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
});
