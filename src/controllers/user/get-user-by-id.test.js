import { faker } from "@faker-js/faker";

import { GetUserByIdController } from "../index.js";

describe("GetUserByIdController", () => {
  class GetUserByIdUseCaseStub {
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
    const GetUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(GetUserByIdUseCase);

    return { sut, GetUserByIdUseCase };
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
    const { sut, GetUserByIdUseCase } = makeSut();
    jest.spyOn(GetUserByIdUseCase, "execute").mockResolvedValueOnce(null);

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 if GetUserByIdUseCase throws", async () => {
    // arrange
    const { sut, GetUserByIdUseCase } = makeSut();
    jest
      .spyOn(GetUserByIdUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });
});
