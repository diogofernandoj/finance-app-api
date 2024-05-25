import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "../index.js";
import { user } from "../../tests/index.js";

describe("GetUserByIdUseCase", () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { sut, getUserByIdRepository };
  };

  it("should get user by id successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(faker.string.uuid());

    // assert
    expect(res).toEqual(user);
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = import.meta.jest.spyOn(getUserByIdRepository, "execute");
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdUseCase if GetUserByIdRepository throws", async () => {
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
});
