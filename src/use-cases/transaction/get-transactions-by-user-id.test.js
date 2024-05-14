import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";
import { user } from "../../tests/index.js";

describe("GetTransactionsByUserId", () => {
  class GetTransactionsByUserIdRepositoryStub {
    async execute() {
      return [];
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdRepository =
      new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionsByUserIdRepository,
      getUserByIdRepository,
    );

    return { sut, getTransactionsByUserIdRepository, getUserByIdRepository };
  };

  it("should get transactions by user id successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(faker.string.uuid());

    // assert
    expect(res).toEqual([]);
  });

  it("should throw UserNotFoundError if user is not found", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);
    const userId = faker.string.uuid();

    // act
    const res = sut.execute(userId);

    // assert
    await expect(res).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should call GetTransactionsByUserId with correct params", async () => {
    // arrange
    const { sut, getTransactionsByUserIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getTransactionsByUserIdRepository, "execute");
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");
    const userId = faker.string.uuid();

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

  it("should throw if GetTransactionsByUserIdRepository throws", async () => {
    // arrange
    const { sut, getTransactionsByUserIdRepository } = makeSut();
    jest
      .spyOn(getTransactionsByUserIdRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid());

    // assert
    await expect(res).rejects.toThrow();
  });
});
