import { PostgresGetUserByIdRepository } from "../repositores/postgres/get-user-by-id.js";

export class GetUserByIdUseCase {
  async execute(userId) {
    const getUserById = new PostgresGetUserByIdRepository();

    const user = await getUserById.execute(userId);

    return user;
  }
}
