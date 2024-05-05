import { faker } from "@faker-js/faker";
import { CreateUserUseCase } from "../index.js";

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

  it("should successfully create a user", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    });

    // assert
    expect(res).toBeTruthy();
  });
});
