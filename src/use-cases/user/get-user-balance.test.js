import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";

describe("GetUserBalanceUseCase", () => {
  const userBalance = {
    earnings: 0,
    expenses: 0,
    invesments: 0,
    balance: 0,
  };

  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return true;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return { sut, getUserBalanceRepository, getUserByIdRepository };
  };

  it("should successfully get user balance", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(faker.string.uuid());

    // assert
    expect(res).toEqual(userBalance);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow(new UserNotFoundError());
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserBalanceRepository with correct params", async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserBalanceRepository, "execute");

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow();
  });
});
