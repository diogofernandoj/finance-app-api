import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdController } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("GetTransactionsByUserId", () => {
  class GetTransactionsByUserIdUseCaseStub {
    async execute() {
      return [
        {
          id: faker.string.uuid(),
          user_id: faker.string.uuid(),
          title: faker.string.alpha(10),
          date: faker.date.anytime().toISOString(),
          amount: faker.number.float(),
          type: faker.helpers.enumValue(TransactionType),
        },
      ];
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdUseCase =
      new GetTransactionsByUserIdUseCaseStub();
    const sut = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase,
    );

    return { sut, getTransactionsByUserIdUseCase };
  };

  const httpRequest = {
    query: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 on getting transactions successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 when missing user id param", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ query: { userId: undefined } });

    // assert
    expect(res.statusCode).toBe(400);
  });
});
