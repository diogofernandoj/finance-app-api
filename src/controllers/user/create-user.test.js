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
        firstName: "Diogo",
        lastName: "Jorge",
        email: "jorge@email.com",
        password: "12345678",
      },
    };

    // act
    const res = await createUserController.execute(httpRequest);

    // assert
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe(httpRequest.body);
  });
});
