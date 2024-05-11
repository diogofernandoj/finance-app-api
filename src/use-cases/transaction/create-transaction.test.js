import { faker } from "@faker-js/faker";
import { CreateTransactionUseCase } from "../index.js";
import { TransactionType } from "@prisma/client";

describe("CreateTransactionUseCase", () => {
  const params = {
    user_id: faker.string.uuid(),
    title: faker.string.alpha(10),
    date: faker.date.anytime().toISOString(),
    type: faker.helpers.enumValue(TransactionType),
    amount: faker.number.float(),
  };

  class CreateTransactionRepositoryStub {
    async execute(transaction) {
      return transaction;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return userId;
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return "generated_id";
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserById = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserById,
      idGeneratorAdapter,
    );

    return {
      sut,
      createTransactionRepository,
      getUserById,
      idGeneratorAdapter,
    };
  };

  it("should create a transaction successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(params);

    // assert
    expect(res).toEqual({ ...params, id: "generated_id" });
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserById } = makeSut();
    const executeSpy = jest.spyOn(getUserById, "execute");

    // act
    await sut.execute(params);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(params.user_id);
  });

  it("should call IdGeneratorAdapter", async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    const executeSpy = jest.spyOn(idGeneratorAdapter, "execute");

    // act
    await sut.execute(params);

    // assert
    expect(executeSpy).toHaveBeenCalled();
  });
});
