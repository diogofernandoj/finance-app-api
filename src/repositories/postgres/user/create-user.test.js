import { user } from "../../../tests/index.js";
import { PostgresCreateUserRepository } from "../index.js";

describe("CreateUserRepository", () => {
  const sut = new PostgresCreateUserRepository();

  it("should create a user on db", async () => {
    const res = await sut.execute(user);

    expect(res.id).toBe(res.id);
    expect(res.firstName).toBe(res.firstName);
    expect(res.lastName).toBe(res.lastName);
    expect(res.email).toBe(res.email);
    expect(res.password).toBe(res.password);
  });
});
