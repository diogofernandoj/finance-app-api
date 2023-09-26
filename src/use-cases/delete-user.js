import { PostgresDeleteUserRepository } from "../repositores/postgres/delete-user.js";

export class DeleteUserUseCase {
  async execute(userId) {
    const deleteUserRepository = new PostgresDeleteUserRepository();

    const deletedUser = await deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
