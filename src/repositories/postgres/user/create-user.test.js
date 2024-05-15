import { user } from "../../../tests/index.js";
import { PostgresCreateUserRepository } from "../index.js";

describe("CreateUserRepository", () => {
  const sut = new PostgresCreateUserRepository();

  it("should create a user on db", async () => {
    const res = await sut.execute(user);

    expect(res).toBeTruthy();
  });
});
