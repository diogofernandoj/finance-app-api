import bcrypt from "bcrypt";

import {
  PostgresGetUserByEmailRepository,
  PostgresUpdateUserRepository,
} from "../repositores/postgres/index.js";
import { EmailIsAlreadyInUseError } from "../errors/user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const getUserByEmail = new PostgresGetUserByEmailRepository();

      const emailAlreadyInUse = await getUserByEmail.execute(
        updateUserParams.email,
      );

      if (emailAlreadyInUse && emailAlreadyInUse.id !== userId) {
        throw new EmailIsAlreadyInUseError(updateUserParams.email);
      }
    }

    const data = {
      ...updateUserParams,
    };

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);

      data.password = hashedPassword;
    }

    const updateUserRepository = new PostgresUpdateUserRepository();

    const updatedUser = updateUserRepository.execute(userId, data);

    return updatedUser;
  }
}
