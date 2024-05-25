import { faker } from "@faker-js/faker";

import { GetUserByIdController } from "../index.js";
import { user } from "../../tests/index.js";

describe("GetUserByIdController", () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return { sut, getUserByIdUseCase };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 on getting user successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 when user id is not valid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ params: { userId: "invalid_id" } });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if no user is found", async () => {
    // arrange
    const { sut, getUserByIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCase, "execute")
      .mockResolvedValueOnce(null);

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 if GetUserByIdUseCase throws", async () => {
    // arrange
    const { sut, getUserByIdUseCase } = makeSut();
    import.meta.jest
      .spyOn(getUserByIdUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should call GetUserByIdUseCase with correct params", async () => {
    // arrange
    const { sut, getUserByIdUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, "execute");

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });
});
