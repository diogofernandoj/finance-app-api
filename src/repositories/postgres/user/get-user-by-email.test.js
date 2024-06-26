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

  it("should call Prisma with correct params", async () => {
    const prismaSpy = import.meta.jest.spyOn(prisma.user, "findUnique");

    await sut.execute(fakeUser.email);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        email: fakeUser.email,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    import.meta.jest
      .spyOn(prisma.user, "findUnique")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(fakeUser.email);

    await expect(res).rejects.toThrow();
  });
});
