import { faker } from "@faker-js/faker";
import { DeleteUserController } from "../index.js";

describe("Delete User Controller", () => {
  class DeleteUserUseCaseStub {
    execute() {
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
    const deleteUserUseCase = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCase);

    return { deleteUserUseCase, sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 on deleting user successfully", async () => {
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

  it("should return 404 if user is not found", async () => {
    // arrange
    const { sut, deleteUserUseCase } = makeSut();
    jest.spyOn(deleteUserUseCase, "execute").mockReturnValueOnce(null);

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });
});
