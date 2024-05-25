import { faker } from "@faker-js/faker";
import { DeleteUserUseCase } from "../index.js";
import { user } from "../../tests/index.js";

describe("DeleteUserUseCase", () => {
  class DeleteUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return { sut, deleteUserRepository };
  };

  it("should successfully delete a user", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const deletedUser = await sut.execute(faker.string.uuid());

    // assert
    expect(deletedUser).toEqual(user);
  });

  it("should call DeleteUserRepository with correct param", async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut();
    const deleteUserSpy = import.meta.jest.spyOn(
      deleteUserRepository,
      "execute",
    );
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId);

    // assert
    expect(deleteUserSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw when DeleteUserRepository throws", async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut();
    import.meta.jest
      .spyOn(deleteUserRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const promise = sut.execute(faker.string.uuid());

    // assert
    await expect(promise).rejects.toThrow();
  });
});
