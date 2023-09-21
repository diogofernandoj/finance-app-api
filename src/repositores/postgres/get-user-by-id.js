import { PostgresClient } from "../../db/postgres/client.js";

export class PostgresGetUserByIdRepository {
  async execute(userId) {
    const user = await PostgresClient.query(
      "SELECT * FROM users WHERE id = $1",
      [userId],
    );

    return user[0];
  }
}
