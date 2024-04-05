import { prisma } from "../../../../prisma/prisma.js";

export class PostgresCreateTransactionRepository {
  async execute(createTransactionParams) {
    return await prisma.transaction.create({
      data: {
        id: createTransactionParams.id,
        user_id: createTransactionParams.user_id,
        title: createTransactionParams.title,
        date: createTransactionParams.date,
        amount: createTransactionParams.amount,
        type: createTransactionParams.type,
      },
    });
  }
}
