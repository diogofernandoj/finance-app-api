import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js";
import {
  makeCreateUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "./user.js";

describe("User Controller Factories", () => {
  it("should return a valid GetUserByIdController instance", () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });

  it("should return a valid CreateUserController instance", () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
  });

  it("should return a valid UpdateUserController instance", () => {
    expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController);
  });
});
