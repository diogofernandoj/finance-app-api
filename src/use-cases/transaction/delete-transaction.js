export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository;
  }

  async execute(transactionId) {
    const deletedTransaction =
      await this.deleteTransactionRepository.execute(transactionId);

    return deletedTransaction;
  }
}
