import { faker } from "@faker-js/faker";
import { CreateUserController } from "../index.js";

describe("Create User Controller", () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  it("should return 201 on creating user successfully", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe(httpRequest.body);
  });

  it("should return 400 if first_name is not provided", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if last_name is not provided", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if email is not valid", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: "invalid_email",
        password: faker.internet.password({ length: 7 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if password is less than 6 characters", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 5 }),
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(400);
  });

  it("should call CreateUserUseCase with correct params", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    const executeSpy = jest.spyOn(createUserUseCase, "execute");

    // act
    await createUserController.execute(httpRequest);

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if CreateUserUseCase throws an error", async () => {
    // arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    jest.spyOn(createUserUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(500);
  });
});
