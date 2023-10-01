import bcrypt from "bcrypt";

import { EmailIsAlreadyInUseError } from "../../errors/user.js";

export class UpdateUserUseCase {
  constructor(updateUserRepository, getUserByEmail) {
    this.updateUserRepository = updateUserRepository;
    this.getUserByEmail = getUserByEmail;
  }

  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const emailAlreadyInUse = await this.getUserByEmail.execute(
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

    const updatedUser = this.updateUserRepository.execute(userId, data);

    return updatedUser;
  }
}
