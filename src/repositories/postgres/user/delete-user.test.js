import { PostgresDeleteUserRepository } from "../index.js";
import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../tests/index.js";

describe("DeleteUserRepository", () => {
  it("should delete a user on db", async () => {
    await prisma.user.create({
      data: user,
    });

    const sut = new PostgresDeleteUserRepository();

    const res = await sut.execute(user.id);

    expect(res).toEqual(user);
  });
});
