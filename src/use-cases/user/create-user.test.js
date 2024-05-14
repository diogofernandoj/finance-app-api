import { CreateUserUseCase } from "../index.js";
import { EmailIsAlreadyInUseError } from "../../errors/user";
import { user as fixtureUser } from "../../tests/index.js";

describe("CreateUserUseCase", () => {
  const user = {
    ...fixtureUser,
    id: undefined,
  };
  class CreateUserRepositoryStub {
    async execute() {
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

  it("should successfully create a user", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(user);

    // assert
    expect(res).toBeTruthy();
  });

  it("should throw an error when GetUserByEmail returns a user", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockResolvedValueOnce(user);

    // act
    const res = sut.execute(user);

    // assert
    await expect(res).rejects.toThrow(new EmailIsAlreadyInUseError(user.email));
  });

  it("should call IdGeneratorAdapter generate random id", async () => {
    // arrange
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    // act
    await sut.execute(user);

    // assert
    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
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
    await sut.execute(user);

    // assert
    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      id: "generated_id",
      password: "hashed_password",
    });
  });

  it("should throw if GetUserByEmail throws", async () => {
    // arrange
    const { sut, getUserByEmail } = makeSut();
    jest.spyOn(getUserByEmail, "execute").mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(user);

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    // act
    const res = sut.execute(user);

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
    const res = sut.execute(user);

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if CreateUserRepository throws", async () => {
    // arrange
    const { sut, createUserRepository } = makeSut();
    jest
      .spyOn(createUserRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(user);

    // assert
    await expect(res).rejects.toThrow();
  });
});
