import { faker } from "@faker-js/faker";
import { CreateUserController } from "../index.js";
import { EmailIsAlreadyInUseError } from "../../errors/user.js";
import { user } from "../../tests/index.js";

describe("Create User Controller", () => {
  class CreateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const sut = new CreateUserController(createUserUseCase);

    return { createUserUseCase, sut };
  };

  const httpRequest = {
    body: { ...user, id: undefined },
  };

  it("should return 201 on creating user successfully", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(user);
  });

  it("should return 400 if first_name is not provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest.body,
      firstName: undefined,
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if last_name is not provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ ...httpRequest.body, lastName: undefined });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ ...httpRequest.body, email: undefined });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is not valid", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest.body,
      email: "invalid_email",
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({ ...httpRequest.body, password: undefined });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is less than 6 characters", async () => {
    // arrange
    const { sut } = makeSut();

    // act
    const res = await sut.execute({
      ...httpRequest.body,
      password: faker.internet.password({ length: 5 }),
    });

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should call CreateUserUseCase with correct params", async () => {
    // arrange
    const { createUserUseCase, sut } = makeSut();

    const executeSpy = import.meta.jest.spyOn(createUserUseCase, "execute");

    // act
    await sut.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if CreateUserUseCase throws an error", async () => {
    // arrange
    const { createUserUseCase, sut } = makeSut();

    import.meta.jest
      .spyOn(createUserUseCase, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    // act
    const res = await sut.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });

  it("should return 500 if CreateUserUseCase throws EmailAlreadyInUseError", async () => {
    // arrange
    const { createUserUseCase, sut } = makeSut();

    import.meta.jest
      .spyOn(createUserUseCase, "execute")
      .mockRejectedValueOnce(
        new EmailIsAlreadyInUseError(httpRequest.body.email),
      );

    // act
    const result = await sut.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(400);
  });
});
