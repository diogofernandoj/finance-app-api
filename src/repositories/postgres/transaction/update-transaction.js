import { PostgresClient } from "../../../db/postgres/client.js";

export class PostgresUpdateTransactionRepository {
  async execute(transactionId, updateTransactionParams) {
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateTransactionParams).forEach((key) => {
      updateFields.push(`${key} = $${updateValues.length + 1}`);
      updateValues.push(updateTransactionParams[key]);
    });

    updateValues.push(transactionId);

    const updateQuery = `
        UPDATE transactions
        SET ${updateFields.join(", ")}
        WHERE id = $${updateValues.length}
        RETURNING *
        `;

    const transaction = await PostgresClient.query(updateQuery, updateValues);

    return transaction;
  }
}
