import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "../index.js";

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
});
