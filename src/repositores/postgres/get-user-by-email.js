import { PostgresClient } from "../../db/postgres/client.js";

export class PostgresGetUserByEmailRepository {
  async execute(userEmail) {
    const user = await PostgresClient.query(
      "SELECT * FROM users WHERE email = $1",
      [userEmail],
    );

    return user[0];
  }
}
