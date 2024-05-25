import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";
import { userBalance } from "../../tests/index.js";

describe("GetUserBalanceUseCase", () => {
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
    import.meta.jest
      .spyOn(getUserByIdRepository, "execute")
      .mockResolvedValueOnce(null);

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow(new UserNotFoundError());
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = import.meta.jest.spyOn(getUserByIdRepository, "execute");

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserBalanceRepository with correct params", async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = import.meta.jest.spyOn(
      getUserBalanceRepository,
      "execute",
    );

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if GetUserBalanceRepository throws", async () => {
    // arrange
    const { sut, getUserBalanceRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserBalanceRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow();
  });
});
