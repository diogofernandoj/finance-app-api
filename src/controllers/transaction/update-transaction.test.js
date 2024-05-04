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
});
