import { faker } from "@faker-js/faker";
import { UpdateUserController } from "../index.js";
import {
  EmailIsAlreadyInUseError,
  UserNotFoundError,
} from "../../errors/user.js";
import { user } from "../../tests/index.js";

describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCase);

    return { sut, updateUserUseCase };
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

  it("should return 400 if an invalid email is provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        email: "invalid_email",
      },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if an invalid password is provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 5 }),
      },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if an unallowed field is provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        unallowedField: "",
      },
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if no user is found", async () => {
    // arrange
    const { sut, updateUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockRejectedValueOnce(new UserNotFoundError());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(404);
  });

  it("should return 500 if UpdateUserUseCase throws an error", async () => {
    // arrange
    const { sut, updateUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should return 500 if UpdateUserUseCase throws EmailAlreadyInUse error", async () => {
    // arrange
    const { sut, updateUserUseCase } = makeSut();
    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockRejectedValueOnce(new EmailIsAlreadyInUseError());

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should call UpdateUserUseCase with correct params", async () => {
    // arrange
    const { sut, updateUserUseCase } = makeSut();
    const executeSpy = import.meta.jest.spyOn(updateUserUseCase, "execute");

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    );
  });
});
