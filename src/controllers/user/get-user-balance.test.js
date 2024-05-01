import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "../index.js";

describe("GetUserBalanceController", () => {
  class GetUserBalanceUseCaseStub {
    execute() {
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
});
