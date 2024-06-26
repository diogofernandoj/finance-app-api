import { PostgresDeleteUserRepository } from "../index.js";
import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../tests/index.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserNotFoundError } from "../../../errors/user.js";

describe("DeleteUserRepository", () => {
  const sut = new PostgresDeleteUserRepository();
  it("should delete a user on db", async () => {
    await prisma.user.create({
      data: user,
    });

    const res = await sut.execute(user.id);

    expect(res).toEqual(user);
  });

  it("should call prisma with correct params", async () => {
    await prisma.user.create({ data: user });
    const prismaSpy = import.meta.jest.spyOn(prisma.user, "delete");

    await sut.execute(user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });

  it("should throw generic error if Prisma throws generic error", async () => {
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest
      .spyOn(prisma.user, "delete")
      .mockRejectedValueOnce(new Error());

    const res = sut.execute(user.id);

    await expect(res).rejects.toThrow();
  });

  it("should throw UserNotFoundError if Prisma does not find record to delete", async () => {
    const sut = new PostgresDeleteUserRepository();
    import.meta.jest.spyOn(prisma.user, "delete").mockRejectedValueOnce(
      new PrismaClientKnownRequestError("", {
        code: "P2025",
      }),
    );

    const res = sut.execute(user.id);

    await expect(res).rejects.toThrow(new UserNotFoundError(user.id));
  });
});
