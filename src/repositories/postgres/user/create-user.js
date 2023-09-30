import { PostgresClient } from "../../../db/postgres/client.js";

export class PostgresCreateUserRepository {
  async execute(createUserParams) {
    await PostgresClient.query(
      "INSERT INTO users (id, firstName, lastName, email, password) VALUES ($1, $2, $3, $4, $5)",
      [
        createUserParams.id,
        createUserParams.firstName,
        createUserParams.lastName,
        createUserParams.email,
        createUserParams.password,
      ],
    );

    const createdUser = await PostgresClient.query(
      "SELECT * FROM users WHERE id = $1",
      [createUserParams.id],
    );

    return createdUser[0];
  }
}
