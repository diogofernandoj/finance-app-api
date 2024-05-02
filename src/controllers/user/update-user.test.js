import { faker } from "@faker-js/faker";
import { UpdateUserController } from "../index.js";

describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user;
    }
  }

  const makeSut = () => {
    const UpdateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(UpdateUserUseCase);

    return { sut, UpdateUserUseCase };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  };

  it("should return 200 on updating user successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(200);
  });

  it("should return 400 if an invalid id is provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      params: { userId: "invalid_id" },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });
});
