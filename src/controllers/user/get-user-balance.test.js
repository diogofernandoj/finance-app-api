import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";
import { userBalance } from "../../tests/index.js";

describe("GetUserBalanceController", () => {
  class GetUserBalanceUseCaseStub {
    async execute() {
      return userBalance;
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
    import.meta.jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should call GetUserBalanceUseCase with correct params", async () => {
    // arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(getUserBalanceUseCase, "execute");

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 404 if GetUserBalanceUseCase throws UserNotFoundError", async () => {
    // arrange
    const { sut, getUserBalanceUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockRejectedValueOnce(new UserNotFoundError());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });
});
