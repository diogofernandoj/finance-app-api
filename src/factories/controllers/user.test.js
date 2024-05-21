import { GetUserByIdController } from "../../controllers/index.js";
import { makeGetUserByIdController } from "./user.js";

describe("User Controller Factories", () => {
  it("should return a valid GetUserByIdController instance", () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });
});
