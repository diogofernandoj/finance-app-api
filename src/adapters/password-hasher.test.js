import { PasswordHasherAdapter } from "./password-hasher.js";
import { faker } from "@faker-js/faker";

describe("PasswordHasherAdapter", () => {
  it("should return a hashed password", async () => {
    const sut = new PasswordHasherAdapter();
    const password = faker.internet.password();

    const res = await sut.execute(password);

    expect(res).toBeTruthy();
    expect(typeof res).toBe("string");
    expect(res).not.toBe(password);
  });
});
