import { UserNotFoundError } from "../../errors/user.js";

export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getUserByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(userId, updateTransactionsParams) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transaction = await this.updateTransactionRepository.execute(
      userId,
      updateTransactionsParams,
    );

    return transaction;
  }
}
