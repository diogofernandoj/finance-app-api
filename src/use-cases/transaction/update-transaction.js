export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
  }

  async execute(transactionId, updateTransactionsParams) {
    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      updateTransactionsParams,
    );

    return transaction;
  }
}
