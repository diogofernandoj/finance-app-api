import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "../index.js";

describe("UpdateUserUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };

  class UpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class GetUserByEmail {
    async execute() {
      return null;
    }
  }

  class PasswordHasherAdapter {
    async execute(password) {
      return password;
    }
  }

  const makeSut = () => {
    const updateUserRepository = new UpdateUserRepositoryStub();
    const getUserByEmail = new GetUserByEmail();
    const passwordHasherAdapter = new PasswordHasherAdapter();
    const sut = new UpdateUserUseCase(
      updateUserRepository,
      getUserByEmail,
      passwordHasherAdapter,
    );

    return { sut, updateUserRepository, getUserByEmail, passwordHasherAdapter };
  };

  it("should update a user successfully (without email and password)", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(faker.string.uuid(), {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });

    // assert
    expect(res).toEqual(user);
  });

  it("should update a user successfully (with email)", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    const executeSpy = jest.spyOn(getUserByEmail, "execute");

    // act
    const res = await sut.execute(faker.string.uuid(), {
      email: user.email,
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith(user.email);
    expect(res).toEqual(user);
  });
});
