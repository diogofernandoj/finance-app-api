import { prisma } from "../../../../prisma/prisma.js";
import { faker } from "@faker-js/faker";
import { PostgresUpdateUserRepository } from "../index.js";
import { user as fakeUser } from "../../../tests/index.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserNotFoundError } from "../../../errors/user.js";

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

    const res = await sut.execute(user.id, updateUserParams);

    expect(res).toEqual(updateUserParams);
  });

  it("should call Prisma with correct params", async () => {
    // arrange
    const user = await prisma.user.create({ data: fakeUser });
    const prismaSpy = jest.spyOn(prisma.user, "update");

    // act
    await sut.execute(user.id, updateUserParams);

    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
      data: updateUserParams,
    });
  });

  it("should throw if Prisma throws", async () => {
    jest.spyOn(prisma.user, "update").mockRejectedValueOnce(new Error());

    const res = sut.execute(updateUserParams);

    await expect(res).rejects.toThrow();
  });

  it("should throw UserNotFoundError if Prisma does not find record to update", async () => {
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prisma.user, "update").mockRejectedValueOnce(
      new PrismaClientKnownRequestError("", {
        code: "P2025",
      }),
    );

    const res = sut.execute(updateUserParams.id);

    await expect(res).rejects.toThrow(
      new UserNotFoundError(updateUserParams.id),
    );
  });
});
