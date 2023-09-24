import bcrypt from "bcrypt";

import { PostgresGetUserByEmailRepository } from "../repositores/postgres/get-user-by-email.js";
import { EmailIsAlreadyInUseError } from "../errors/user.js";
import { PostgresUpdateUserRepository } from "../repositores/postgres/update-user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const emailAlreadyInUse = new PostgresGetUserByEmailRepository(
        updateUserParams.email,
      );

      if (emailAlreadyInUse) {
        throw new EmailIsAlreadyInUseError(updateUserParams.email);
      }
    }

    const data = {
      ...updateUserParams,
    };

    if (updateUserParams.password) {
      const hashedPassword = bcrypt.hash(updateUserParams.password, 10);

      data.password = hashedPassword;
    }

    const updateUserRepository = new PostgresUpdateUserRepository();

    const updatedUser = updateUserRepository.execute(userId, data);

    return updatedUser;
  }
}
