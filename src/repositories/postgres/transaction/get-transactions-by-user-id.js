import { PostgresClient } from "../../../db/postgres/client.js";

export class PostgresGetTransactionsByUserIdRepository {
  async execute(userId) {
    const transactions = await PostgresClient.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [userId],
    );

    return transactions;
  }
}
