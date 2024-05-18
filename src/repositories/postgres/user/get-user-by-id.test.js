import { user as fakeUser } from "../../../tests/index.js";
import { prisma } from "../../../../prisma/prisma.js";
import { PostgresGetUserByIdRepository } from "../index.js";

describe("PostgresGetUserByIdRepository", () => {
  const sut = new PostgresGetUserByIdRepository();
  it("should get user by id on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });

    const res = await sut.execute(user.id);

    expect(res).toEqual(user);
  });

  it("should call Prisma with correct params", async () => {
    const prismaSpy = jest.spyOn(prisma.user, "findUnique");

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },
    });
  });
});
