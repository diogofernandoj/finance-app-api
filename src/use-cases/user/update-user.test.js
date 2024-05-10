import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "../index.js";
import { EmailIsAlreadyInUseError } from "../../errors/user.js";

describe("UpdateUserUseCase", () => {
  const user = {
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
    async execute() {
      return "hashed_password";
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

  it("should update a user successfully (with password)", async () => {
    // arrange
    const { sut, passwordHasherAdapter } = makeSut();
    const executeSpy = jest.spyOn(passwordHasherAdapter, "execute");

    // act
    const res = await sut.execute(faker.string.uuid(), {
      password: user.password,
    });

    // assert
    expect(executeSpy).toHaveBeenCalledWith(user.password);
    expect(res).toEqual(user);
  });

  it("should throw EmailAlreadyInUseError if email is already in use", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockResolvedValueOnce(true);

    // act
    const res = sut.execute(faker.string.uuid(), {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    // assert
    await expect(res).rejects.toThrow(new EmailIsAlreadyInUseError(user.email));
  });

  it("should call UpdateUserRepository with correct params", async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut();
    const executeSpy = jest.spyOn(updateUserRepository, "execute");
    const userId = faker.string.uuid();

    // act
    await sut.execute(userId, user);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId, {
      ...user,
      password: "hashed_password",
    });
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    });

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if PasswordHasherAdapter throws", async () => {
    // arrange
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid(), {
      password: faker.internet.password({ length: 7 }),
    });

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if UpdateUserRepository throws", async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut();
    jest
      .spyOn(updateUserRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(faker.string.uuid(), user);

    // assert
    await expect(res).rejects.toThrow();
  });
});
