import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";

describe("GetTransactionsByUserId", () => {
  class GetTransactionsByUserIdRepositoryStub {
    async execute() {
      return [];
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      };
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
});
