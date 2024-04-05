import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const {
      _sum: { amount: totalEarnings },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: "EARNING",
      },
      _sum: {
        amount: true,
      },
    });

    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    });

    const {
      _sum: { amount: totalInvestments },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: "INVESTMENT",
      },
      _sum: {
        amount: true,
      },
    });

    const earnings = totalEarnings || 0;
    const expenses = totalExpenses || 0;
    const investments = totalInvestments || 0;
    const balance = earnings - expenses - investments;

    return {
      earnings,
      expenses,
      investments,
      balance,
    };
  }
}
