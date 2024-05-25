import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdController } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";
import { transaction } from "../../tests/index.js";

describe("GetTransactionsByUserId", () => {
  class GetTransactionsByUserIdUseCaseStub {
    async execute() {
      return [transaction];
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

  it("should return 400 when user id is invalid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ query: { userId: "invalid_id" } });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when GetTransactionsUseCase throws UserNotFoundError", async () => {
    // arrange
    const { sut, getTransactionsByUserIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getTransactionsByUserIdUseCase, "execute")
      .mockRejectedValueOnce(new UserNotFoundError());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 when GetTransactionsUseCase throws", async () => {
    // arrange
    const { sut, getTransactionsByUserIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getTransactionsByUserIdUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should call GetTransactionsByUserIdUseCase with correct params", async () => {
    // arrange
    const { sut, getTransactionsByUserIdUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(
      getTransactionsByUserIdUseCase,
      "execute",
    );

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId);
  });
});
