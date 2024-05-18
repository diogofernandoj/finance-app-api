import { prisma } from "../../../../prisma/prisma.js";
import { PostgresGetUserByEmailRepository } from "../index.js";
import { user as fakeUser } from "../../../tests/index.js";

describe("GetUserByEmailRepository", () => {
  const sut = new PostgresGetUserByEmailRepository();
  it("should get user by email on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });

    const res = await sut.execute(user.email);

    expect(res).toEqual(user);
  });
});
