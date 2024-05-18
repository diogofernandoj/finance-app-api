import { prisma } from "../../../../prisma/prisma.js";
import { faker } from "@faker-js/faker";
import { PostgresUpdateUserRepository } from "../index.js";
import { user as fakeUser } from "../../../tests/index.js";

describe("PostgresUpdateUserRepository", () => {
  const sut = new PostgresUpdateUserRepository();

  const updateUserParams = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it("should update user on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toEqual(updateUserParams);
  });
});
