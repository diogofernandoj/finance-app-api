import { prisma } from "../../../../prisma/prisma.js";

export class PostgresCreateUserRepository {
  async execute(createUserParams) {
    return await prisma.user.create({
      data: {
        id: createUserParams.id,
        firstName: createUserParams.firstName,
        lastName: createUserParams.lastName,
        email: createUserParams.email,
        password: createUserParams.password,
      },
    });
  }
}
