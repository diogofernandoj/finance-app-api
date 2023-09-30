import { PostgresClient } from "../../../db/postgres/client.js";

export class PostgresCreateTransactionRepository {
  async execute(createTransactionParams) {
    const createdTransaction = await PostgresClient.query(
      `INSERT INTO transactions (id, user_id, title, date, amount, type) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [
        createTransactionParams.id,
        createTransactionParams.user_id,
        createTransactionParams.title,
        createTransactionParams.date,
        createTransactionParams.amount,
        createTransactionParams.type,
      ],
    );

    return createdTransaction[0];
  }
}
