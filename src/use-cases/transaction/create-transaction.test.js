import { CreateTransactionUseCase } from "../index.js";
import { UserNotFoundError } from "../../errors/user.js";
import { transaction, user } from "../../tests/index.js";

describe("CreateTransactionUseCase", () => {
  class CreateTransactionRepositoryStub {
    async execute() {
      return transaction;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId };
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
    const res = await sut.execute(transaction);

    // assert
    expect(res).toEqual(transaction);
  });

  it("should call GetUserByIdRepository with correct param", async () => {
    // arrange
    const { sut, getUserById } = makeSut();
    const executeSpy = jest.spyOn(getUserById, "execute");

    // act
    await sut.execute(transaction);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.user_id);
  });

  it("should call IdGeneratorAdapter", async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    const executeSpy = jest.spyOn(idGeneratorAdapter, "execute");

    // act
    await sut.execute(transaction);

    // assert
    expect(executeSpy).toHaveBeenCalled();
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut();
    const executeSpy = jest.spyOn(createTransactionRepository, "execute");

    // act
    await sut.execute(transaction);

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...transaction,
      id: "generated_id",
    });
  });

  it("should throw UserNotFoundError if no user is found", async () => {
    // arrange
    const { sut, getUserById } = makeSut();
    jest.spyOn(getUserById, "execute").mockResolvedValueOnce(null);

    // act
    const res = sut.execute(transaction);

    // assert
    await expect(res).rejects.toThrow(
      new UserNotFoundError(transaction.user_id),
    );
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    // arrange
    const { sut, getUserById } = makeSut();
    jest.spyOn(getUserById, "execute").mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(transaction);

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut();
    jest
      .spyOn(idGeneratorAdapter, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(transaction);

    // assert
    await expect(res).rejects.toThrow();
  });

  it("should throw if CreateTransactionRepository throws", async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut();
    jest
      .spyOn(createTransactionRepository, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = sut.execute(transaction);

    // assert
    await expect(res).rejects.toThrow();
  });
});
