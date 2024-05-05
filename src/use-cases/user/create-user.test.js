import { faker } from "@faker-js/faker";
import { CreateUserUseCase } from "../index.js";
import { EmailIsAlreadyInUseError } from "../../errors/user";

describe("CreateUserUseCase", () => {
  class CreateUserRepositoryStub {
    async execute(user) {
      return user;
    }
  }

  class GetUserByEmailStub {
    async execute() {
      return null;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return "generated_id";
    }
  }

  const makeSut = () => {
    const createUserRepository = new CreateUserRepositoryStub();
    const getUserByEmail = new GetUserByEmailStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmail,
      passwordHasherAdapter,
      idGeneratorAdapter,
    );

    return {
      sut,
      createUserRepository,
      getUserByEmail,
      passwordHasherAdapter,
      idGeneratorAdapter,
    };
  };

  const params = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  };

  it("should successfully create a user", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const user = await sut.execute(params);

    // assert
    expect(user).toBeTruthy();
  });

  it("should throw an error when GetUserByEmail returns a user", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockResolvedValueOnce(params);

    // act
    const user = sut.execute(params);

    // assert
    await expect(user).rejects.toThrow(
      new EmailIsAlreadyInUseError(params.email),
    );
  });

  it("should call IdGeneratorAdapter generate random id", async () => {
    // arrange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    // act
    await sut.execute(params);

    // assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...params,
      id: "generated_id",
      password: "hashed_password",
    });
  });

  it("should call PasswordHasherAdapter to encrypt password", async () => {
    // arrange
    const { sut, createUserRepository, passwordHasherAdapter } = makeSut();
    const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    // act
    await sut.execute(params);

    // assert
    expect(passwordHasherSpy).toHaveBeenCalledWith(params.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...params,
      id: "generated_id",
      password: "hashed_password",
    });
  });

  it("should throw if GetUserByEmail throws", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockRejectedValueOnce(new Error());

    // act
    const user = sut.execute(params);

    // assert
    await expect(user).rejects.toThrow();
  });
});
