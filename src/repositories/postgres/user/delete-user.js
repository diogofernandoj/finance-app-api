import { PostgresClient } from "../../../db/postgres/client.js";

export class PostgresDeleteUserRepository {
  async execute(userId) {
    const deletedUser = await PostgresClient.query(
      `DELETE FROM users
      WHERE id = $1
      RETURNING *`,
      [userId],
    );

    return deletedUser[0];
  }
}
