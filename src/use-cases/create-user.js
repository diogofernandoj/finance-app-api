import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { PostgresCreateUserRepository } from "../repositores/postgres/create-user.js";
import { PostgresGetUserByEmailRepository } from "../repositores/postgres/get-user-by-email.js";
import { EmailIsAlreadyInUseError } from "../errors/user.js";

export class CreateUserUseCase {
  async execute(createUserParams) {
    const getUserByEmail = new PostgresGetUserByEmailRepository();
    const userAlreadyExists = await getUserByEmail.execute(
      createUserParams.email,
    );

    if (userAlreadyExists) {
      throw new EmailIsAlreadyInUseError(createUserParams.email);
    }

    const userId = uuidv4();

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const createUserRepository = new PostgresCreateUserRepository();

    return await createUserRepository.execute(user);
  }
}
