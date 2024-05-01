import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "../index.js";

describe("GetUserBalanceController", () => {
  class GetUserBalanceUseCaseStub {
    async execute() {
      return {
        earnings: faker.number.float(),
        expenses: faker.number.float(),
        investment: faker.number.float(),
        balance: faker.number.float(),
      };
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return { sut, getUserBalanceUseCase };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 on getting user balance successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 when user id is not valid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ params: { userId: "invalid_id" } });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 500 if GetUserBalanceUseCase throws", async () => {
    // arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });
});
