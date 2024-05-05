import { faker } from "@faker-js/faker";
import { DeleteUserUseCase } from "../index.js";

describe("DeleteUserUseCase", () => {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };

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
});
